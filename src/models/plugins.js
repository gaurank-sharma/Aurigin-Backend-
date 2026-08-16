// Exposes `id` (a plain string, whether the underlying _id is a Mongo
// ObjectId or a custom string slug) instead of `_id`/`__v`, so API
// responses match the shape the existing frontend already expects.
// `omit` additionally strips any other fields that should never leave the
// server (e.g. a password hash).
export function withIdJSON(schema, omit = []) {
  schema.set("toJSON", {
    versionKey: false,
    transform: (_doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      for (const field of omit) delete ret[field];
      return ret;
    },
  });
}
