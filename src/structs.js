import * as s from "superstruct";
import isUuid from "is-uuids";

const uuid = s.defion("Uuid", (value) => isUuid.v4(value));

export const CreateArticle = s.object({
  title: s.size(s.string(), 1, 50),
  content: s.string(),
});

export const CreateProduct = s.object({
  name: s.size(s.string(), 1, 20),
  description: s.optional(s.string()),
  price: s.min(s.number(), 0),
  tags: s.enums(TAG),
});
