import { Database } from "@/server/db";
import { promises as fs } from "fs";
import os from "os";
import path from "path";

export async function createTempDatabase(seed: Database) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "ecommerce-clean-arch-"));
  const file = path.join(directory, "db.json");

  await fs.writeFile(file, JSON.stringify(seed));
  process.env.DB_FILE = file;

  return {
    read: async (): Promise<Database> => JSON.parse(await fs.readFile(file, "utf-8")),
    cleanup: async () => {
      delete process.env.DB_FILE;
      await fs.rm(directory, { recursive: true, force: true });
    },
  };
}
