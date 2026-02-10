import { z } from 'zod';
import type { Prisma } from '../../../generated/prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','email','name','password']);

export const CategoryScalarFieldEnumSchema = z.enum(['id','name']);

export const TripScalarFieldEnumSchema = z.enum(['id','name','categoryId','costPerPerson','address','country','indoor','link','description','lastDone','timesCompleted','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  password: z.string(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// CATEGORY SCHEMA
/////////////////////////////////////////

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
})

export type Category = z.infer<typeof CategorySchema>

/////////////////////////////////////////
// TRIP SCHEMA
/////////////////////////////////////////

export const TripSchema = z.object({
  id: z.string(),
  name: z.string(),
  categoryId: z.string(),
  costPerPerson: z.number().nullable(),
  address: z.string(),
  country: z.string(),
  indoor: z.boolean(),
  link: z.string().nullable(),
  description: z.string().nullable(),
  lastDone: z.coerce.date().nullable(),
  timesCompleted: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Trip = z.infer<typeof TripSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  name: z.boolean().optional(),
  password: z.boolean().optional(),
}).strict()

// CATEGORY
//------------------------------------------------------

export const CategoryIncludeSchema: z.ZodType<Prisma.CategoryInclude> = z.object({
  trips: z.union([z.boolean(),z.lazy(() => TripFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CategoryCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const CategoryArgsSchema: z.ZodType<Prisma.CategoryDefaultArgs> = z.object({
  select: z.lazy(() => CategorySelectSchema).optional(),
  include: z.lazy(() => CategoryIncludeSchema).optional(),
}).strict();

export const CategoryCountOutputTypeArgsSchema: z.ZodType<Prisma.CategoryCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CategoryCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CategoryCountOutputTypeSelectSchema: z.ZodType<Prisma.CategoryCountOutputTypeSelect> = z.object({
  trips: z.boolean().optional(),
}).strict();

export const CategorySelectSchema: z.ZodType<Prisma.CategorySelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  trips: z.union([z.boolean(),z.lazy(() => TripFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CategoryCountOutputTypeArgsSchema)]).optional(),
}).strict()

// TRIP
//------------------------------------------------------

export const TripIncludeSchema: z.ZodType<Prisma.TripInclude> = z.object({
  category: z.union([z.boolean(),z.lazy(() => CategoryArgsSchema)]).optional(),
}).strict();

export const TripArgsSchema: z.ZodType<Prisma.TripDefaultArgs> = z.object({
  select: z.lazy(() => TripSelectSchema).optional(),
  include: z.lazy(() => TripIncludeSchema).optional(),
}).strict();

export const TripSelectSchema: z.ZodType<Prisma.TripSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  categoryId: z.boolean().optional(),
  costPerPerson: z.boolean().optional(),
  address: z.boolean().optional(),
  country: z.boolean().optional(),
  indoor: z.boolean().optional(),
  link: z.boolean().optional(),
  description: z.boolean().optional(),
  lastDone: z.boolean().optional(),
  timesCompleted: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  category: z.union([z.boolean(),z.lazy(() => CategoryArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
});

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
});

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    email: z.string(),
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.strictObject({
  id: z.string().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
}));

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
});

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const CategoryWhereInputSchema: z.ZodType<Prisma.CategoryWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => CategoryWhereInputSchema), z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryWhereInputSchema), z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  trips: z.lazy(() => TripListRelationFilterSchema).optional(),
});

export const CategoryOrderByWithRelationInputSchema: z.ZodType<Prisma.CategoryOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  trips: z.lazy(() => TripOrderByRelationAggregateInputSchema).optional(),
});

export const CategoryWhereUniqueInputSchema: z.ZodType<Prisma.CategoryWhereUniqueInput> = z.object({
  id: z.string(),
})
.and(z.strictObject({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => CategoryWhereInputSchema), z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryWhereInputSchema), z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  trips: z.lazy(() => TripListRelationFilterSchema).optional(),
}));

export const CategoryOrderByWithAggregationInputSchema: z.ZodType<Prisma.CategoryOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CategoryCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CategoryMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CategoryMinOrderByAggregateInputSchema).optional(),
});

export const CategoryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CategoryScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema), z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema), z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const TripWhereInputSchema: z.ZodType<Prisma.TripWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => TripWhereInputSchema), z.lazy(() => TripWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TripWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TripWhereInputSchema), z.lazy(() => TripWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  costPerPerson: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  address: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  country: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  indoor: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  link: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  lastDone: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  timesCompleted: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  category: z.union([ z.lazy(() => CategoryScalarRelationFilterSchema), z.lazy(() => CategoryWhereInputSchema) ]).optional(),
});

export const TripOrderByWithRelationInputSchema: z.ZodType<Prisma.TripOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  costPerPerson: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  indoor: z.lazy(() => SortOrderSchema).optional(),
  link: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastDone: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  timesCompleted: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => CategoryOrderByWithRelationInputSchema).optional(),
});

export const TripWhereUniqueInputSchema: z.ZodType<Prisma.TripWhereUniqueInput> = z.object({
  id: z.string(),
})
.and(z.strictObject({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => TripWhereInputSchema), z.lazy(() => TripWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TripWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TripWhereInputSchema), z.lazy(() => TripWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  costPerPerson: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  address: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  country: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  indoor: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  link: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  lastDone: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  timesCompleted: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  category: z.union([ z.lazy(() => CategoryScalarRelationFilterSchema), z.lazy(() => CategoryWhereInputSchema) ]).optional(),
}));

export const TripOrderByWithAggregationInputSchema: z.ZodType<Prisma.TripOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  costPerPerson: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  indoor: z.lazy(() => SortOrderSchema).optional(),
  link: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  lastDone: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  timesCompleted: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TripCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => TripAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TripMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TripMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => TripSumOrderByAggregateInputSchema).optional(),
});

export const TripScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TripScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => TripScalarWhereWithAggregatesInputSchema), z.lazy(() => TripScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TripScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TripScalarWhereWithAggregatesInputSchema), z.lazy(() => TripScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  costPerPerson: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  address: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  country: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  indoor: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
  link: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  lastDone: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date() ]).optional().nullable(),
  timesCompleted: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.strictObject({
  id: z.string().optional(),
  email: z.string(),
  name: z.string(),
  password: z.string(),
});

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.strictObject({
  id: z.string().optional(),
  email: z.string(),
  name: z.string(),
  password: z.string(),
});

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.strictObject({
  id: z.string().optional(),
  email: z.string(),
  name: z.string(),
  password: z.string(),
});

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const CategoryCreateInputSchema: z.ZodType<Prisma.CategoryCreateInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  trips: z.lazy(() => TripCreateNestedManyWithoutCategoryInputSchema).optional(),
});

export const CategoryUncheckedCreateInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  trips: z.lazy(() => TripUncheckedCreateNestedManyWithoutCategoryInputSchema).optional(),
});

export const CategoryUpdateInputSchema: z.ZodType<Prisma.CategoryUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  trips: z.lazy(() => TripUpdateManyWithoutCategoryNestedInputSchema).optional(),
});

export const CategoryUncheckedUpdateInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  trips: z.lazy(() => TripUncheckedUpdateManyWithoutCategoryNestedInputSchema).optional(),
});

export const CategoryCreateManyInputSchema: z.ZodType<Prisma.CategoryCreateManyInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
});

export const CategoryUpdateManyMutationInputSchema: z.ZodType<Prisma.CategoryUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const CategoryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const TripCreateInputSchema: z.ZodType<Prisma.TripCreateInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  costPerPerson: z.number().optional().nullable(),
  address: z.string(),
  country: z.string(),
  indoor: z.boolean().optional(),
  link: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  lastDone: z.coerce.date().optional().nullable(),
  timesCompleted: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  category: z.lazy(() => CategoryCreateNestedOneWithoutTripsInputSchema),
});

export const TripUncheckedCreateInputSchema: z.ZodType<Prisma.TripUncheckedCreateInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  categoryId: z.string(),
  costPerPerson: z.number().optional().nullable(),
  address: z.string(),
  country: z.string(),
  indoor: z.boolean().optional(),
  link: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  lastDone: z.coerce.date().optional().nullable(),
  timesCompleted: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const TripUpdateInputSchema: z.ZodType<Prisma.TripUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  costPerPerson: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  indoor: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastDone: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timesCompleted: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.lazy(() => CategoryUpdateOneRequiredWithoutTripsNestedInputSchema).optional(),
});

export const TripUncheckedUpdateInputSchema: z.ZodType<Prisma.TripUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  costPerPerson: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  indoor: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastDone: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timesCompleted: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const TripCreateManyInputSchema: z.ZodType<Prisma.TripCreateManyInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  categoryId: z.string(),
  costPerPerson: z.number().optional().nullable(),
  address: z.string(),
  country: z.string(),
  indoor: z.boolean().optional(),
  link: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  lastDone: z.coerce.date().optional().nullable(),
  timesCompleted: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const TripUpdateManyMutationInputSchema: z.ZodType<Prisma.TripUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  costPerPerson: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  indoor: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastDone: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timesCompleted: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const TripUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TripUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  costPerPerson: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  indoor: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastDone: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timesCompleted: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
});

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
});

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
});

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const TripListRelationFilterSchema: z.ZodType<Prisma.TripListRelationFilter> = z.strictObject({
  every: z.lazy(() => TripWhereInputSchema).optional(),
  some: z.lazy(() => TripWhereInputSchema).optional(),
  none: z.lazy(() => TripWhereInputSchema).optional(),
});

export const TripOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TripOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const CategoryCountOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
});

export const CategoryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
});

export const CategoryMinOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
});

export const FloatNullableFilterSchema: z.ZodType<Prisma.FloatNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
});

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
});

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
});

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
});

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
});

export const CategoryScalarRelationFilterSchema: z.ZodType<Prisma.CategoryScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => CategoryWhereInputSchema).optional(),
  isNot: z.lazy(() => CategoryWhereInputSchema).optional(),
});

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.strictObject({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional(),
});

export const TripCountOrderByAggregateInputSchema: z.ZodType<Prisma.TripCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  costPerPerson: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  indoor: z.lazy(() => SortOrderSchema).optional(),
  link: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  lastDone: z.lazy(() => SortOrderSchema).optional(),
  timesCompleted: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const TripAvgOrderByAggregateInputSchema: z.ZodType<Prisma.TripAvgOrderByAggregateInput> = z.strictObject({
  costPerPerson: z.lazy(() => SortOrderSchema).optional(),
  timesCompleted: z.lazy(() => SortOrderSchema).optional(),
});

export const TripMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TripMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  costPerPerson: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  indoor: z.lazy(() => SortOrderSchema).optional(),
  link: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  lastDone: z.lazy(() => SortOrderSchema).optional(),
  timesCompleted: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const TripMinOrderByAggregateInputSchema: z.ZodType<Prisma.TripMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  costPerPerson: z.lazy(() => SortOrderSchema).optional(),
  address: z.lazy(() => SortOrderSchema).optional(),
  country: z.lazy(() => SortOrderSchema).optional(),
  indoor: z.lazy(() => SortOrderSchema).optional(),
  link: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  lastDone: z.lazy(() => SortOrderSchema).optional(),
  timesCompleted: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const TripSumOrderByAggregateInputSchema: z.ZodType<Prisma.TripSumOrderByAggregateInput> = z.strictObject({
  costPerPerson: z.lazy(() => SortOrderSchema).optional(),
  timesCompleted: z.lazy(() => SortOrderSchema).optional(),
});

export const FloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.FloatNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
});

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
});

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
});

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
});

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
});

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional(),
});

export const TripCreateNestedManyWithoutCategoryInputSchema: z.ZodType<Prisma.TripCreateNestedManyWithoutCategoryInput> = z.strictObject({
  create: z.union([ z.lazy(() => TripCreateWithoutCategoryInputSchema), z.lazy(() => TripCreateWithoutCategoryInputSchema).array(), z.lazy(() => TripUncheckedCreateWithoutCategoryInputSchema), z.lazy(() => TripUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TripCreateOrConnectWithoutCategoryInputSchema), z.lazy(() => TripCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TripCreateManyCategoryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TripWhereUniqueInputSchema), z.lazy(() => TripWhereUniqueInputSchema).array() ]).optional(),
});

export const TripUncheckedCreateNestedManyWithoutCategoryInputSchema: z.ZodType<Prisma.TripUncheckedCreateNestedManyWithoutCategoryInput> = z.strictObject({
  create: z.union([ z.lazy(() => TripCreateWithoutCategoryInputSchema), z.lazy(() => TripCreateWithoutCategoryInputSchema).array(), z.lazy(() => TripUncheckedCreateWithoutCategoryInputSchema), z.lazy(() => TripUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TripCreateOrConnectWithoutCategoryInputSchema), z.lazy(() => TripCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TripCreateManyCategoryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TripWhereUniqueInputSchema), z.lazy(() => TripWhereUniqueInputSchema).array() ]).optional(),
});

export const TripUpdateManyWithoutCategoryNestedInputSchema: z.ZodType<Prisma.TripUpdateManyWithoutCategoryNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => TripCreateWithoutCategoryInputSchema), z.lazy(() => TripCreateWithoutCategoryInputSchema).array(), z.lazy(() => TripUncheckedCreateWithoutCategoryInputSchema), z.lazy(() => TripUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TripCreateOrConnectWithoutCategoryInputSchema), z.lazy(() => TripCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TripUpsertWithWhereUniqueWithoutCategoryInputSchema), z.lazy(() => TripUpsertWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TripCreateManyCategoryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TripWhereUniqueInputSchema), z.lazy(() => TripWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TripWhereUniqueInputSchema), z.lazy(() => TripWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TripWhereUniqueInputSchema), z.lazy(() => TripWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TripWhereUniqueInputSchema), z.lazy(() => TripWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TripUpdateWithWhereUniqueWithoutCategoryInputSchema), z.lazy(() => TripUpdateWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TripUpdateManyWithWhereWithoutCategoryInputSchema), z.lazy(() => TripUpdateManyWithWhereWithoutCategoryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TripScalarWhereInputSchema), z.lazy(() => TripScalarWhereInputSchema).array() ]).optional(),
});

export const TripUncheckedUpdateManyWithoutCategoryNestedInputSchema: z.ZodType<Prisma.TripUncheckedUpdateManyWithoutCategoryNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => TripCreateWithoutCategoryInputSchema), z.lazy(() => TripCreateWithoutCategoryInputSchema).array(), z.lazy(() => TripUncheckedCreateWithoutCategoryInputSchema), z.lazy(() => TripUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TripCreateOrConnectWithoutCategoryInputSchema), z.lazy(() => TripCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TripUpsertWithWhereUniqueWithoutCategoryInputSchema), z.lazy(() => TripUpsertWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TripCreateManyCategoryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TripWhereUniqueInputSchema), z.lazy(() => TripWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TripWhereUniqueInputSchema), z.lazy(() => TripWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TripWhereUniqueInputSchema), z.lazy(() => TripWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TripWhereUniqueInputSchema), z.lazy(() => TripWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TripUpdateWithWhereUniqueWithoutCategoryInputSchema), z.lazy(() => TripUpdateWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TripUpdateManyWithWhereWithoutCategoryInputSchema), z.lazy(() => TripUpdateManyWithWhereWithoutCategoryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TripScalarWhereInputSchema), z.lazy(() => TripScalarWhereInputSchema).array() ]).optional(),
});

export const CategoryCreateNestedOneWithoutTripsInputSchema: z.ZodType<Prisma.CategoryCreateNestedOneWithoutTripsInput> = z.strictObject({
  create: z.union([ z.lazy(() => CategoryCreateWithoutTripsInputSchema), z.lazy(() => CategoryUncheckedCreateWithoutTripsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutTripsInputSchema).optional(),
  connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional(),
});

export const NullableFloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.strictObject({
  set: z.boolean().optional(),
});

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional().nullable(),
});

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.strictObject({
  set: z.coerce.date().optional().nullable(),
});

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.strictObject({
  set: z.coerce.date().optional(),
});

export const CategoryUpdateOneRequiredWithoutTripsNestedInputSchema: z.ZodType<Prisma.CategoryUpdateOneRequiredWithoutTripsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => CategoryCreateWithoutTripsInputSchema), z.lazy(() => CategoryUncheckedCreateWithoutTripsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutTripsInputSchema).optional(),
  upsert: z.lazy(() => CategoryUpsertWithoutTripsInputSchema).optional(),
  connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CategoryUpdateToOneWithWhereWithoutTripsInputSchema), z.lazy(() => CategoryUpdateWithoutTripsInputSchema), z.lazy(() => CategoryUncheckedUpdateWithoutTripsInputSchema) ]).optional(),
});

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
});

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
});

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
});

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
});

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
});

export const NestedFloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
});

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
});

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
});

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
});

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
});

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
});

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
});

export const TripCreateWithoutCategoryInputSchema: z.ZodType<Prisma.TripCreateWithoutCategoryInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  costPerPerson: z.number().optional().nullable(),
  address: z.string(),
  country: z.string(),
  indoor: z.boolean().optional(),
  link: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  lastDone: z.coerce.date().optional().nullable(),
  timesCompleted: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const TripUncheckedCreateWithoutCategoryInputSchema: z.ZodType<Prisma.TripUncheckedCreateWithoutCategoryInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  costPerPerson: z.number().optional().nullable(),
  address: z.string(),
  country: z.string(),
  indoor: z.boolean().optional(),
  link: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  lastDone: z.coerce.date().optional().nullable(),
  timesCompleted: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const TripCreateOrConnectWithoutCategoryInputSchema: z.ZodType<Prisma.TripCreateOrConnectWithoutCategoryInput> = z.strictObject({
  where: z.lazy(() => TripWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TripCreateWithoutCategoryInputSchema), z.lazy(() => TripUncheckedCreateWithoutCategoryInputSchema) ]),
});

export const TripCreateManyCategoryInputEnvelopeSchema: z.ZodType<Prisma.TripCreateManyCategoryInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => TripCreateManyCategoryInputSchema), z.lazy(() => TripCreateManyCategoryInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const TripUpsertWithWhereUniqueWithoutCategoryInputSchema: z.ZodType<Prisma.TripUpsertWithWhereUniqueWithoutCategoryInput> = z.strictObject({
  where: z.lazy(() => TripWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TripUpdateWithoutCategoryInputSchema), z.lazy(() => TripUncheckedUpdateWithoutCategoryInputSchema) ]),
  create: z.union([ z.lazy(() => TripCreateWithoutCategoryInputSchema), z.lazy(() => TripUncheckedCreateWithoutCategoryInputSchema) ]),
});

export const TripUpdateWithWhereUniqueWithoutCategoryInputSchema: z.ZodType<Prisma.TripUpdateWithWhereUniqueWithoutCategoryInput> = z.strictObject({
  where: z.lazy(() => TripWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TripUpdateWithoutCategoryInputSchema), z.lazy(() => TripUncheckedUpdateWithoutCategoryInputSchema) ]),
});

export const TripUpdateManyWithWhereWithoutCategoryInputSchema: z.ZodType<Prisma.TripUpdateManyWithWhereWithoutCategoryInput> = z.strictObject({
  where: z.lazy(() => TripScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TripUpdateManyMutationInputSchema), z.lazy(() => TripUncheckedUpdateManyWithoutCategoryInputSchema) ]),
});

export const TripScalarWhereInputSchema: z.ZodType<Prisma.TripScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => TripScalarWhereInputSchema), z.lazy(() => TripScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TripScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TripScalarWhereInputSchema), z.lazy(() => TripScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  costPerPerson: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  address: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  country: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  indoor: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  link: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  lastDone: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  timesCompleted: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
});

export const CategoryCreateWithoutTripsInputSchema: z.ZodType<Prisma.CategoryCreateWithoutTripsInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
});

export const CategoryUncheckedCreateWithoutTripsInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateWithoutTripsInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
});

export const CategoryCreateOrConnectWithoutTripsInputSchema: z.ZodType<Prisma.CategoryCreateOrConnectWithoutTripsInput> = z.strictObject({
  where: z.lazy(() => CategoryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CategoryCreateWithoutTripsInputSchema), z.lazy(() => CategoryUncheckedCreateWithoutTripsInputSchema) ]),
});

export const CategoryUpsertWithoutTripsInputSchema: z.ZodType<Prisma.CategoryUpsertWithoutTripsInput> = z.strictObject({
  update: z.union([ z.lazy(() => CategoryUpdateWithoutTripsInputSchema), z.lazy(() => CategoryUncheckedUpdateWithoutTripsInputSchema) ]),
  create: z.union([ z.lazy(() => CategoryCreateWithoutTripsInputSchema), z.lazy(() => CategoryUncheckedCreateWithoutTripsInputSchema) ]),
  where: z.lazy(() => CategoryWhereInputSchema).optional(),
});

export const CategoryUpdateToOneWithWhereWithoutTripsInputSchema: z.ZodType<Prisma.CategoryUpdateToOneWithWhereWithoutTripsInput> = z.strictObject({
  where: z.lazy(() => CategoryWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CategoryUpdateWithoutTripsInputSchema), z.lazy(() => CategoryUncheckedUpdateWithoutTripsInputSchema) ]),
});

export const CategoryUpdateWithoutTripsInputSchema: z.ZodType<Prisma.CategoryUpdateWithoutTripsInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const CategoryUncheckedUpdateWithoutTripsInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateWithoutTripsInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const TripCreateManyCategoryInputSchema: z.ZodType<Prisma.TripCreateManyCategoryInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  costPerPerson: z.number().optional().nullable(),
  address: z.string(),
  country: z.string(),
  indoor: z.boolean().optional(),
  link: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  lastDone: z.coerce.date().optional().nullable(),
  timesCompleted: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const TripUpdateWithoutCategoryInputSchema: z.ZodType<Prisma.TripUpdateWithoutCategoryInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  costPerPerson: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  indoor: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastDone: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timesCompleted: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const TripUncheckedUpdateWithoutCategoryInputSchema: z.ZodType<Prisma.TripUncheckedUpdateWithoutCategoryInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  costPerPerson: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  indoor: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastDone: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timesCompleted: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const TripUncheckedUpdateManyWithoutCategoryInputSchema: z.ZodType<Prisma.TripUncheckedUpdateManyWithoutCategoryInput> = z.strictObject({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  costPerPerson: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  country: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  indoor: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  link: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lastDone: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  timesCompleted: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(), UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(), 
  having: UserScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const CategoryFindFirstArgsSchema: z.ZodType<Prisma.CategoryFindFirstArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(), 
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(), CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema, CategoryScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CategoryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CategoryFindFirstOrThrowArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(), 
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(), CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema, CategoryScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CategoryFindManyArgsSchema: z.ZodType<Prisma.CategoryFindManyArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(), 
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(), CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema, CategoryScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CategoryAggregateArgsSchema: z.ZodType<Prisma.CategoryAggregateArgs> = z.object({
  where: CategoryWhereInputSchema.optional(), 
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(), CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const CategoryGroupByArgsSchema: z.ZodType<Prisma.CategoryGroupByArgs> = z.object({
  where: CategoryWhereInputSchema.optional(), 
  orderBy: z.union([ CategoryOrderByWithAggregationInputSchema.array(), CategoryOrderByWithAggregationInputSchema ]).optional(),
  by: CategoryScalarFieldEnumSchema.array(), 
  having: CategoryScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const CategoryFindUniqueArgsSchema: z.ZodType<Prisma.CategoryFindUniqueArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema, 
}).strict();

export const CategoryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CategoryFindUniqueOrThrowArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema, 
}).strict();

export const TripFindFirstArgsSchema: z.ZodType<Prisma.TripFindFirstArgs> = z.object({
  select: TripSelectSchema.optional(),
  include: TripIncludeSchema.optional(),
  where: TripWhereInputSchema.optional(), 
  orderBy: z.union([ TripOrderByWithRelationInputSchema.array(), TripOrderByWithRelationInputSchema ]).optional(),
  cursor: TripWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TripScalarFieldEnumSchema, TripScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const TripFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TripFindFirstOrThrowArgs> = z.object({
  select: TripSelectSchema.optional(),
  include: TripIncludeSchema.optional(),
  where: TripWhereInputSchema.optional(), 
  orderBy: z.union([ TripOrderByWithRelationInputSchema.array(), TripOrderByWithRelationInputSchema ]).optional(),
  cursor: TripWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TripScalarFieldEnumSchema, TripScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const TripFindManyArgsSchema: z.ZodType<Prisma.TripFindManyArgs> = z.object({
  select: TripSelectSchema.optional(),
  include: TripIncludeSchema.optional(),
  where: TripWhereInputSchema.optional(), 
  orderBy: z.union([ TripOrderByWithRelationInputSchema.array(), TripOrderByWithRelationInputSchema ]).optional(),
  cursor: TripWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TripScalarFieldEnumSchema, TripScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const TripAggregateArgsSchema: z.ZodType<Prisma.TripAggregateArgs> = z.object({
  where: TripWhereInputSchema.optional(), 
  orderBy: z.union([ TripOrderByWithRelationInputSchema.array(), TripOrderByWithRelationInputSchema ]).optional(),
  cursor: TripWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const TripGroupByArgsSchema: z.ZodType<Prisma.TripGroupByArgs> = z.object({
  where: TripWhereInputSchema.optional(), 
  orderBy: z.union([ TripOrderByWithAggregationInputSchema.array(), TripOrderByWithAggregationInputSchema ]).optional(),
  by: TripScalarFieldEnumSchema.array(), 
  having: TripScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const TripFindUniqueArgsSchema: z.ZodType<Prisma.TripFindUniqueArgs> = z.object({
  select: TripSelectSchema.optional(),
  include: TripIncludeSchema.optional(),
  where: TripWhereUniqueInputSchema, 
}).strict();

export const TripFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TripFindUniqueOrThrowArgs> = z.object({
  select: TripSelectSchema.optional(),
  include: TripIncludeSchema.optional(),
  where: TripWhereUniqueInputSchema, 
}).strict();

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  data: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
}).strict();

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereUniqueInputSchema, 
  create: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
}).strict();

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  data: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CategoryCreateArgsSchema: z.ZodType<Prisma.CategoryCreateArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  data: z.union([ CategoryCreateInputSchema, CategoryUncheckedCreateInputSchema ]),
}).strict();

export const CategoryUpsertArgsSchema: z.ZodType<Prisma.CategoryUpsertArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema, 
  create: z.union([ CategoryCreateInputSchema, CategoryUncheckedCreateInputSchema ]),
  update: z.union([ CategoryUpdateInputSchema, CategoryUncheckedUpdateInputSchema ]),
}).strict();

export const CategoryCreateManyArgsSchema: z.ZodType<Prisma.CategoryCreateManyArgs> = z.object({
  data: z.union([ CategoryCreateManyInputSchema, CategoryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const CategoryCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CategoryCreateManyAndReturnArgs> = z.object({
  data: z.union([ CategoryCreateManyInputSchema, CategoryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const CategoryDeleteArgsSchema: z.ZodType<Prisma.CategoryDeleteArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema, 
}).strict();

export const CategoryUpdateArgsSchema: z.ZodType<Prisma.CategoryUpdateArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  data: z.union([ CategoryUpdateInputSchema, CategoryUncheckedUpdateInputSchema ]),
  where: CategoryWhereUniqueInputSchema, 
}).strict();

export const CategoryUpdateManyArgsSchema: z.ZodType<Prisma.CategoryUpdateManyArgs> = z.object({
  data: z.union([ CategoryUpdateManyMutationInputSchema, CategoryUncheckedUpdateManyInputSchema ]),
  where: CategoryWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CategoryUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.CategoryUpdateManyAndReturnArgs> = z.object({
  data: z.union([ CategoryUpdateManyMutationInputSchema, CategoryUncheckedUpdateManyInputSchema ]),
  where: CategoryWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CategoryDeleteManyArgsSchema: z.ZodType<Prisma.CategoryDeleteManyArgs> = z.object({
  where: CategoryWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const TripCreateArgsSchema: z.ZodType<Prisma.TripCreateArgs> = z.object({
  select: TripSelectSchema.optional(),
  include: TripIncludeSchema.optional(),
  data: z.union([ TripCreateInputSchema, TripUncheckedCreateInputSchema ]),
}).strict();

export const TripUpsertArgsSchema: z.ZodType<Prisma.TripUpsertArgs> = z.object({
  select: TripSelectSchema.optional(),
  include: TripIncludeSchema.optional(),
  where: TripWhereUniqueInputSchema, 
  create: z.union([ TripCreateInputSchema, TripUncheckedCreateInputSchema ]),
  update: z.union([ TripUpdateInputSchema, TripUncheckedUpdateInputSchema ]),
}).strict();

export const TripCreateManyArgsSchema: z.ZodType<Prisma.TripCreateManyArgs> = z.object({
  data: z.union([ TripCreateManyInputSchema, TripCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const TripCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TripCreateManyAndReturnArgs> = z.object({
  data: z.union([ TripCreateManyInputSchema, TripCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const TripDeleteArgsSchema: z.ZodType<Prisma.TripDeleteArgs> = z.object({
  select: TripSelectSchema.optional(),
  include: TripIncludeSchema.optional(),
  where: TripWhereUniqueInputSchema, 
}).strict();

export const TripUpdateArgsSchema: z.ZodType<Prisma.TripUpdateArgs> = z.object({
  select: TripSelectSchema.optional(),
  include: TripIncludeSchema.optional(),
  data: z.union([ TripUpdateInputSchema, TripUncheckedUpdateInputSchema ]),
  where: TripWhereUniqueInputSchema, 
}).strict();

export const TripUpdateManyArgsSchema: z.ZodType<Prisma.TripUpdateManyArgs> = z.object({
  data: z.union([ TripUpdateManyMutationInputSchema, TripUncheckedUpdateManyInputSchema ]),
  where: TripWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const TripUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.TripUpdateManyAndReturnArgs> = z.object({
  data: z.union([ TripUpdateManyMutationInputSchema, TripUncheckedUpdateManyInputSchema ]),
  where: TripWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const TripDeleteManyArgsSchema: z.ZodType<Prisma.TripDeleteManyArgs> = z.object({
  where: TripWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();