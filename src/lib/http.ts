import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return ok({ error: "Invalid request", issues: error.flatten() }, { status: 400 });
  }

  console.error(error);
  return ok({ error: "Something went wrong" }, { status: 500 });
}
