import { Null, u128, u64, Text, Vec, bool, GenericAccountId as AccountId, BTreeSet, BTreeMap } from '@polkadot/types'
import { RegistryTypes } from '@polkadot/types/types'
import { JoyBTreeSet, JoyEnum, JoyStructDecorated, WorkingGroup } from './common'

export class BalanceOf extends u128 {}
export class DataObjectId extends u64 {}
export class StorageBucketId extends u64 {}

export type StorageBucketsPerBagValueConstraintType = {
  min: u64
  max_min_diff: u64
}

export class StorageBucketsPerBagValueConstraint
  extends JoyStructDecorated({
    min: u64,
    max_min_diff: u64,
  })
  implements StorageBucketsPerBagValueConstraintType {}

//TODO: implement these types
export class DynamicBagId extends u64 {}
export class DynamicBag extends u64 {}

export type DataObjectType = {
  accepted: bool
  deletion_prize: BalanceOf
  size: u64
}

export class DataObject
  extends JoyStructDecorated({
    accepted: bool,
    deletion_prize: BalanceOf,
    size: u64,
  })
  implements DataObjectType {}

export class DataObjectIdSet extends JoyBTreeSet(DataObjectId) {}
export class DataObjectIdMap extends BTreeMap.with(DataObjectId, DataObject) {}
export class DistributionBucketId extends u64 {}
export class StorageBucketIdSet extends JoyBTreeSet(StorageBucketId) {}
export class DistributionBucketSet extends JoyBTreeSet(DistributionBucketId) {}

export type StaticBagType = {
  objects: DataObjectIdMap
  stored_by: StorageBucketIdSet
  distributed_by: DistributionBucketSet
}

export class StaticBag
  extends JoyStructDecorated({
    objects: DataObjectIdMap,
    stored_by: StorageBucketIdSet,
    distributed_by: DistributionBucketSet,
  })
  implements StaticBagType {}

export type DynamicBagCreationPolicyType = {
  numberOfStorageBuckets: u64
}

export class DynamicBagCreationPolicy
  extends JoyStructDecorated({
    numberOfStorageBuckets: u64,
  })
  implements DynamicBagCreationPolicyType {}

export const DynamicBagTypeDef = {
  Member: Null,
  Channel: Null,
} as const
export type DynamicBagTypeKey = keyof typeof DynamicBagTypeDef
export class DynamicBagType extends JoyEnum(DynamicBagTypeDef) {}

export const StaticBagIdDef = {
  Council: Null,
  WorkingGroup: WorkingGroup,
} as const
export type StaticBagIdKey = keyof typeof StaticBagIdDef
export class StaticBagId extends JoyEnum(StaticBagIdDef) {}

export class Static extends StaticBagId {}

export const BagIdDef = {
  Static,
  Dynamic: Null, //TODO: implement dynamic type
} as const
export type BagIdKey = keyof typeof BagIdDef
export class BagId extends JoyEnum(BagIdDef) {}

// Alias
export class BagIdType extends BagId {}

export type VoucherType = {
  sizeLimit: u64
  objectsLimit: u64
  sizeUsed: u64
  objectsUsed: u64
}

export class Voucher
  extends JoyStructDecorated({
    sizeLimit: u64,
    objectsLimit: u64,
    sizeUsed: u64,
    objectsUsed: u64,
  })
  implements VoucherType {}

export const StorageBucketOperatorStatusDef = {
  Missing: Null,
  InvitedStorageWorker: u64,
  StorageWorker: u64,
} as const
export type StorageBucketOperatorStatusKey = keyof typeof StorageBucketOperatorStatusDef
export class StorageBucketOperatorStatus extends JoyEnum(StorageBucketOperatorStatusDef) {}

export type StorageBucketType = {
  operator_status: StorageBucketOperatorStatus
  accepting_new_bags: bool
  voucher: Voucher
  metadata: Text
}

export class StorageBucket
  extends JoyStructDecorated({
    operator_status: StorageBucketOperatorStatus,
    accepting_new_bags: bool,
    voucher: Voucher,
    metadata: Text,
  })
  implements StorageBucketType {}

export type DataObjectCreationParametersType = {
  size: u64
  ipfsContentId: Text
}

export class DataObjectCreationParameters
  extends JoyStructDecorated({
    size: u64,
    ipfsContentId: Text,
  })
  implements DataObjectCreationParametersType {}

export type UploadParametersType = {
  authenticationKey: Text
  bagId: BagId
  objectCreationList: Vec<DataObjectCreationParameters>
  deletionPrizeSourceAccountId: AccountId
}

export class UploadParameters
  extends JoyStructDecorated({
    authenticationKey: Text,
    bagId: BagId,
    objectCreationList: Vec.with(DataObjectCreationParameters),
    deletionPrizeSourceAccountId: AccountId,
  })
  implements UploadParametersType {}

export class ContentId extends Text {}
export class ContentIdSet extends BTreeSet.with(ContentId) {}

export const storageTypes: RegistryTypes = {
  StorageBucketId,
  StorageBucketsPerBagValueConstraint,
  DataObjectId,
  DynamicBagId,
  Voucher,
  DynamicBagType,
  DynamicBagCreationPolicy,
  DynamicBag,
  StaticBag,
  StorageBucket,
  StaticBagId,
  Static,
  BagId,
  DataObjectCreationParameters,
  BagIdType,
  UploadParameters,
  StorageBucketIdSet,
  DataObjectIdSet,
  ContentIdSet,
  ContentId,
  StorageBucketOperatorStatus,
}
export default storageTypes
