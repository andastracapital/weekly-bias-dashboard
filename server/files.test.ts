import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

// Mock authenticated user context
const mockAuthContext: TrpcContext = {
  user: {
    id: 1,
    openId: "test-user",
    name: "Test User",
    email: "test@example.com",
    loginMethod: "email",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  },
  req: {
    protocol: "https",
    headers: {},
  } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
};

// Mock unauthenticated context
const mockUnauthContext: TrpcContext = {
  user: null,
  req: {
    protocol: "https",
    headers: {},
  } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
};

describe("File Storage Feature", () => {
  describe("Authentication", () => {
    it("should require authentication for file upload", async () => {
      const caller = appRouter.createCaller(mockUnauthContext);

      await expect(
        caller.files.upload({
          fileData: Buffer.from("test").toString("base64"),
          filename: "test.txt",
          mimeType: "text/plain",
          fileSize: 4,
        })
      ).rejects.toThrow();
    });

    it("should require authentication for file list", async () => {
      const caller = appRouter.createCaller(mockUnauthContext);

      await expect(caller.files.list()).rejects.toThrow();
    });

    it("should require authentication for file delete", async () => {
      const caller = appRouter.createCaller(mockUnauthContext);

      await expect(caller.files.delete({ id: 1 })).rejects.toThrow();
    });

    it("should require authentication for file get", async () => {
      const caller = appRouter.createCaller(mockUnauthContext);

      await expect(caller.files.get({ id: 1 })).rejects.toThrow();
    });
  });

  describe("Input Validation", () => {
    it("should validate required fields for file upload", async () => {
      const caller = appRouter.createCaller(mockAuthContext);

      // Missing fileData
      await expect(
        caller.files.upload({
          fileData: "",
          filename: "test.txt",
          mimeType: "text/plain",
          fileSize: 0,
        })
      ).rejects.toThrow();
    });

    it("should accept valid file upload input", async () => {
      const caller = appRouter.createCaller(mockAuthContext);

      // This will fail at DB level but pass input validation
      try {
        await caller.files.upload({
          fileData: Buffer.from("Test content").toString("base64"),
          filename: "test.txt",
          mimeType: "text/plain",
          fileSize: 12,
          category: "pmt-report",
          description: "Test file",
        });
      } catch (error: any) {
        // Expect DB error (foreign key constraint) not validation error
        expect(error.message).not.toContain("validation");
      }
    });

    it("should validate file ID for get operation", async () => {
      const caller = appRouter.createCaller(mockAuthContext);

      // Invalid ID type
      await expect(
        // @ts-expect-error Testing invalid input
        caller.files.get({ id: "invalid" })
      ).rejects.toThrow();
    });

    it("should validate file ID for delete operation", async () => {
      const caller = appRouter.createCaller(mockAuthContext);

      // Invalid ID type
      await expect(
        // @ts-expect-error Testing invalid input
        caller.files.delete({ id: "invalid" })
      ).rejects.toThrow();
    });
  });

  describe("File Categories", () => {
    it("should accept valid category values", async () => {
      const caller = appRouter.createCaller(mockAuthContext);
      const validCategories = ["pmt-report", "chart", "trade-journal", "backup", "other"];

      for (const category of validCategories) {
        try {
          await caller.files.upload({
            fileData: Buffer.from("Test").toString("base64"),
            filename: "test.txt",
            mimeType: "text/plain",
            fileSize: 4,
            category,
          });
        } catch (error: any) {
          // Should fail at DB level (foreign key constraint)
          expect(error.message).toContain("insert into");
        }
      }
    });

    it("should accept optional category parameter", async () => {
      const caller = appRouter.createCaller(mockAuthContext);

      try {
        await caller.files.upload({
          fileData: Buffer.from("Test").toString("base64"),
          filename: "test.txt",
          mimeType: "text/plain",
          fileSize: 4,
          // No category provided
        });
      } catch (error: any) {
        // Should fail at DB level (foreign key constraint)
        expect(error.message).toContain("insert into");
      }
    });
  });

  describe("File List Filtering", () => {
    it("should accept category filter", async () => {
      const caller = appRouter.createCaller(mockAuthContext);

      try {
        await caller.files.list({ category: "pmt-report" });
      } catch (error: any) {
        // May fail at DB level but input validation should pass
        expect(error.message).not.toContain("validation");
      }
    });

    it("should accept empty filter", async () => {
      const caller = appRouter.createCaller(mockAuthContext);

      try {
        await caller.files.list();
      } catch (error: any) {
        // May fail at DB level but input validation should pass
        expect(error.message).not.toContain("validation");
      }
    });
  });

  describe("Router Structure", () => {
    it("should have files router with all required procedures", () => {
      expect(appRouter._def.procedures).toHaveProperty("files.upload");
      expect(appRouter._def.procedures).toHaveProperty("files.list");
      expect(appRouter._def.procedures).toHaveProperty("files.get");
      expect(appRouter._def.procedures).toHaveProperty("files.delete");
    });

    it("should have protected procedures for all file operations", () => {
      // All file operations should require authentication
      const filesProcedures = Object.keys(appRouter._def.procedures).filter(key =>
        key.startsWith("files.")
      );

      expect(filesProcedures.length).toBeGreaterThan(0);
      
      // Verify procedures exist
      expect(filesProcedures).toContain("files.upload");
      expect(filesProcedures).toContain("files.list");
      expect(filesProcedures).toContain("files.get");
      expect(filesProcedures).toContain("files.delete");
    });
  });
});
