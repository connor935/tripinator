'use client'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react";
import * as z from "zod"

import { Category, TripSchema } from "@/prisma/generated/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Textarea } from "@/components/ui/textarea";

export default function AddTripForm({ categories }: { categories: Category[] }) {

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(TripSchema),
  })

  useEffect(() => {
    console.log(errors)
  }, [errors])

  return (
    <form
      onSubmit={handleSubmit((data) => {
        // handle inputs
        console.log(data)
      })}
      className="flex flex-col gap-2 w-96"
    >
      <Input {...register("name")} placeholder="name" errorMessage={errors?.name?.message} />
      <select {...register("categoryId")}>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
        </select>
      <Input {...register("costPerPerson")} type="number" placeholder="cost per person [€]" errorMessage={errors?.costPerPerson?.message} defaultValue={10.00}/>
      <Input {...register("address")} placeholder="address" errorMessage={errors?.address?.message} />
      <Input {...register("country")} placeholder="country" errorMessage={errors?.country?.message} />
      <input {...register("indoor"  )} type="checkbox"/>
      <Input {...register("link")} placeholder="link" errorMessage={errors?.link?.message} />
      <Textarea {...register("description")} placeholder="description" errorMessage={errors?.description?.message} />
      <Button variant="secondary" type="submit">Submit me</Button>
    </form>
  );
}

