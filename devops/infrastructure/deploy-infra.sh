#!/bin/bash

set -e

if [ -z "$1" ]; then
  echo "ERROR: Configuration file not passed"
  echo "Please use ./deploy-infra.sh PATH/TO/CONFIG to run this script"
  exit 1
else
  echo "Using $1 file for config"
  source $1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --profile $CLI_PROFILE --query Account --output text)

NEW_STACK_NAME="${STACK_NAME}-${ACCOUNT_ID}"

DATA_PATH="data-$NEW_STACK_NAME"

INVENTORY_PATH="$DATA_PATH/inventory"

if [ $ACCOUNT_ID == None ]; then
    echo "Couldn't find Account ID, please check if AWS Profile $CLI_PROFILE is set"
    exit 1
fi

if [ ! -f "$KEY_PATH" ]; then
    echo "Key file not found at $KEY_PATH"
    exit 1
fi

# Deploy the CloudFormation template
echo -e "\n\n=========== Deploying main.yml ==========="
aws cloudformation deploy \
  --region $REGION \
  --profile $CLI_PROFILE \
  --stack-name $NEW_STACK_NAME \
  --template-file main.yml \
  --no-fail-on-empty-changeset \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    EC2InstanceType=$EC2_INSTANCE_TYPE \
    KeyName=$AWS_KEY_PAIR_NAME \
    EC2AMI=$EC2_AMI_ID

# If the deploy succeeded, get the IP, create inventory and configure the created instances
if [ $? -eq 0 ]; then
  # Install additional Ansible roles from requirements
  ansible-galaxy install -r requirements.yml

  VALIDATORS=$(aws cloudformation list-exports \
    --profile $CLI_PROFILE \
    --query "Exports[?starts_with(Name,'${NEW_STACK_NAME}PublicIp')].Value" \
    --output text | sed 's/\t\t*/\n/g')

  RPC_NODES=$(aws cloudformation list-exports \
    --profile $CLI_PROFILE \
    --query "Exports[?starts_with(Name,'${NEW_STACK_NAME}RPCPublicIp')].Value" \
    --output text | sed 's/\t\t*/\n/g')

  BUILD_SERVER=$(aws cloudformation list-exports \
    --profile $CLI_PROFILE \
    --query "Exports[?starts_with(Name,'${NEW_STACK_NAME}BuildPublicIp')].Value" \
    --output text | sed 's/\t\t*/\n/g')

  mkdir -p $DATA_PATH

  echo -e "[build]\n$BUILD_SERVER\n\n[validators]\n$VALIDATORS\n\n[rpc]\n$RPC_NODES" > $INVENTORY_PATH

  if [ -z "$EC2_AMI_ID" ]
  then
    echo -e "\n\n=========== Configuring the node servers ==========="
    ansible-playbook -i $INVENTORY_PATH --private-key $KEY_PATH build-code.yml --extra-vars "branch_name=$BRANCH_NAME git_repo=$GIT_REPO build_local_code=$BUILD_LOCAL_CODE"
  fi

  echo -e "\n\n=========== Configuring the Build server ==========="
  ansible-playbook -i $INVENTORY_PATH --private-key $KEY_PATH setup-admin.yml \
    --extra-vars "local_dir=$LOCAL_CODE_PATH build_local_code=$BUILD_LOCAL_CODE"

  echo -e "\n\n=========== Configuring the chain spec file ==========="
  ansible-playbook -i $INVENTORY_PATH --private-key $KEY_PATH chain-spec-configuration.yml \
    --extra-vars "local_dir=$LOCAL_CODE_PATH network_suffix=$NETWORK_SUFFIX data_path=data-$NEW_STACK_NAME"
fi