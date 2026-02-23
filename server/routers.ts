import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { storagePut } from "./storage";
import { createFile, getUserFiles, getFileById, deleteFile } from "./db";
import { nanoid } from "nanoid";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  files: router({
    /**
     * Upload a file to S3 and store metadata in database
     * Input: base64-encoded file data, filename, mimeType, category, description
     */
    upload: protectedProcedure
      .input(
        z.object({
          fileData: z.string(), // base64-encoded file data
          filename: z.string(),
          mimeType: z.string(),
          fileSize: z.number(),
          category: z.string().optional(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Decode base64 file data
        const buffer = Buffer.from(input.fileData, "base64");

        // Generate unique storage key
        const fileExt = input.filename.split(".").pop() || "";
        const storageKey = `user-${ctx.user.id}/files/${nanoid()}.${fileExt}`;

        // Upload to S3
        const { url } = await storagePut(storageKey, buffer, input.mimeType);

        // Save metadata to database
        await createFile({
          userId: ctx.user.id,
          filename: input.filename,
          storageKey,
          url,
          mimeType: input.mimeType,
          fileSize: input.fileSize,
          category: input.category,
          description: input.description,
        });

        return { success: true, url };
      }),

    /**
     * List all files for the current user
     * Optional filter by category
     */
    list: protectedProcedure
      .input(
        z
          .object({
            category: z.string().optional(),
          })
          .optional()
      )
      .query(async ({ ctx, input }) => {
        const files = await getUserFiles(ctx.user.id, input?.category);
        return files;
      }),

    /**
     * Get a single file by ID
     */
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const file = await getFileById(input.id);
        
        // Only allow users to access their own files
        if (!file || file.userId !== ctx.user.id) {
          throw new Error("File not found");
        }
        
        return file;
      }),

    /**
     * Delete a file
     */
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const file = await getFileById(input.id);
        
        // Only allow users to delete their own files
        if (!file || file.userId !== ctx.user.id) {
          throw new Error("File not found");
        }
        
        await deleteFile(input.id, ctx.user.id);
        
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
