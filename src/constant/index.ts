import { createBucketClient } from '@cosmicjs/sdk'

export const cosmic = createBucketClient({
  bucketSlug: `${process.env.BUCKET_SLUG}`,
  readKey: `${process.env.READ_KEY}`,
  writeKey: `${process.env.WRITE_KEY}`,
})
