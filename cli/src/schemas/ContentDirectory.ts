import { keysOf } from '@joystream/types'
import {
  PalletContentIterableEnumsChannelActionPermission,
  PalletContentPermissionsCuratorGroupIterableEnumsContentModerationAction,
  PalletContentPermissionsCuratorGroupIterableEnumsPausableChannelFeature,
} from '@polkadot/types/lookup'
import {
  ChannelCreationInputParameters,
  ChannelUpdateInputParameters,
  VideoInputParameters,
  VideoCategoryInputParameters,
  JsonSchema,
  ModerationPermissionsByLevelInputParameters,
  PropertySchema,
  ContentModerationActionNullEnum,
} from '../Types'

export const VideoCategoryInputSchema: JsonSchema<VideoCategoryInputParameters> = {
  type: 'object',
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
      required: false,
    },
    parentCategoryId: {
      type: 'string',
      required: false,
    },
  },
}

export const ChannelCreationInputSchema: JsonSchema<ChannelCreationInputParameters> = {
  type: 'object',
  additionalProperties: false,
  properties: {
    description: { type: 'string' },
    isPublic: { type: 'boolean' },
    language: { type: 'string' },
    title: { type: 'string' },
    coverPhotoPath: { type: 'string' },
    avatarPhotoPath: { type: 'string' },
    collaborators: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          memberId: { type: 'integer' },
          permissions: {
            type: 'array',
            items: {
              type: 'string',
              enum: keysOf<
                PalletContentIterableEnumsChannelActionPermission,
                'PalletContentIterableEnumsChannelActionPermission'
              >('PalletContentIterableEnumsChannelActionPermission'),
            },
          },
        },
      },
    },
    privilegeLevel: { type: 'integer' },
  },
}

const contentModerationActionsEnumOptions = [
  { DeleteVideoAssets: true },
  { DeleteVideoAssets: false },

  ...keysOf<
    PalletContentPermissionsCuratorGroupIterableEnumsContentModerationAction,
    'PalletContentPermissionsCuratorGroupIterableEnumsContentModerationAction'
  >('PalletContentPermissionsCuratorGroupIterableEnumsContentModerationAction')
    .filter((e) => e !== 'DeleteVideoAssets' && e !== 'ChangeChannelFeatureStatus')
    .map((e) => ({ [e]: null } as ContentModerationActionNullEnum)),

  ...keysOf<
    PalletContentPermissionsCuratorGroupIterableEnumsPausableChannelFeature,
    'PalletContentPermissionsCuratorGroupIterableEnumsPausableChannelFeature'
  >('PalletContentPermissionsCuratorGroupIterableEnumsPausableChannelFeature').map((c) => ({
    ChangeChannelFeatureStatus: c,
  })),
]

export const ModerationPermissionsByLevelInputSchema: PropertySchema<ModerationPermissionsByLevelInputParameters> = {
  type: 'array',
  items: {
    type: 'object',
    additionalProperties: false,
    properties: {
      channelPrivilegeLevel: { type: 'number' },
      permissions: {
        type: 'array',
        items: {
          type: 'object',
          enum: contentModerationActionsEnumOptions,
        },
      },
    },
  },
}

export const ChannelUpdateInputSchema: JsonSchema<ChannelUpdateInputParameters> = {
  ...ChannelCreationInputSchema,
}
delete (ChannelUpdateInputSchema as Record<string, unknown>).moderators

export const VideoInputSchema: JsonSchema<VideoInputParameters> = {
  type: 'object',
  additionalProperties: false,
  properties: {
    category: { type: 'string' },
    description: { type: 'string' },
    duration: { type: 'number' },
    hasMarketing: { type: 'boolean' },
    isExplicit: { type: 'boolean' },
    isPublic: { type: 'boolean' },
    language: { type: 'string' },
    license: {
      type: 'object',
      properties: {
        code: {
          type: 'number',
        },
        attribution: {
          type: 'string',
        },
        customText: {
          type: 'string',
        },
      },
    },
    mediaPixelHeight: { type: 'number' },
    mediaPixelWidth: { type: 'number' },
    mediaType: {
      type: 'object',
      properties: {
        codecName: {
          type: 'string',
        },
        container: {
          type: 'string',
        },
        mimeMediaType: {
          type: 'string',
        },
      },
    },
    persons: {
      type: 'array',
      items: {
        type: 'integer',
      },
    },
    publishedBeforeJoystream: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
        },
        isPublished: {
          type: 'boolean',
        },
      },
    },
    subtitles: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
          },
          language: {
            type: 'string',
          },
          mimeType: {
            type: 'string',
          },
          subtitleAssetPath: {
            type: 'string',
          },
        },
      },
    },
    clearSubtitles: { type: 'boolean' },
    thumbnailPhotoPath: { type: 'string' },
    title: { type: 'string' },
    videoPath: { type: 'string' },
    enableComments: { type: 'boolean' },
  },
}
