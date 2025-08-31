import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file type
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "text/csv", // .csv
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Please upload an Excel file (.xlsx, .xls) or CSV file.",
        },
        { status: 400 },
      );
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Parse Excel file
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonData.length < 2) {
      return NextResponse.json(
        { error: "File is empty or has no data rows" },
        { status: 400 },
      );
    }

    // Get headers (first row)
    const headers = jsonData[0] as string[];
    const dataRows = jsonData.slice(1) as unknown[][];

    // Expected columns mapping
    const expectedColumns = {
      title: ["title", "song title", "name", "song name"],
      bpm: ["bpm", "tempo", "beats per minute"],
      originalSinger: ["original singer", "singer", "artist", "performer"],
      author: ["author", "writer", "composer"],
      style: ["style", "genre", "category"],
      tags: ["tags", "tag", "keywords"],
      nature: ["nature", "mood", "feeling"],
      lyrics: ["lyrics", "lyric", "text", "words"],
    };

    // Map headers to expected columns
    const columnMap: Record<string, number> = {};

    headers.forEach((header, index) => {
      const normalizedHeader = header.toLowerCase().trim();

      for (const [expectedKey, possibleNames] of Object.entries(
        expectedColumns,
      )) {
        if (possibleNames.includes(normalizedHeader)) {
          columnMap[expectedKey] = index;
          break;
        }
      }
    });

    // Validate required columns
    const requiredColumns = [
      "title",
      "bpm",
      "originalSinger",
      "author",
      "style",
      "tags",
      "nature",
    ];
    const missingColumns = requiredColumns.filter(
      (col) => columnMap[col] === undefined,
    );

    if (missingColumns.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required columns: ${missingColumns.join(
            ", ",
          )}. Please ensure your Excel file has these columns.`,
          expectedColumns: Object.fromEntries(
            Object.entries(expectedColumns).map(([key, values]) => [
              key,
              values,
            ]),
          ),
        },
        { status: 400 },
      );
    }

    // Process data rows
    const results = {
      success: 0,
      errors: [] as string[],
      skipped: 0,
    };

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const rowNumber = i + 2; // +2 because we start from row 2 (after headers)

      try {
        // Extract data from row
        const title = row[columnMap.title!]?.toString().trim();
        const bpm = row[columnMap.bpm!];
        const originalSinger = row[columnMap.originalSinger!]
          ?.toString()
          .trim();
        const author = row[columnMap.author!]?.toString().trim();
        const style = row[columnMap.style!]?.toString().trim();
        const tags = row[columnMap.tags!]?.toString().trim();
        const nature = row[columnMap.nature!]?.toString().trim();
        const lyrics = row[columnMap.lyrics!]?.toString().trim();

        // Validate required fields
        if (!title) {
          results.errors.push(`Row ${rowNumber}: Title is required`);
          continue;
        }

        if (!bpm || bpm.toString().trim() === "") {
          results.errors.push(`Row ${rowNumber}: BPM is required`);
          continue;
        }

        if (!originalSinger) {
          results.errors.push(`Row ${rowNumber}: Original Singer is required`);
          continue;
        }

        if (!author) {
          results.errors.push(`Row ${rowNumber}: Author is required`);
          continue;
        }

        if (!style) {
          results.errors.push(`Row ${rowNumber}: Style is required`);
          continue;
        }

        if (!tags) {
          results.errors.push(`Row ${rowNumber}: Tags are required`);
          continue;
        }

        if (!nature) {
          results.errors.push(`Row ${rowNumber}: Nature is required`);
          continue;
        }

        // Check if song already exists
        const existingSong = await prisma.song.findFirst({
          where: { title: title },
        });

        if (existingSong) {
          results.skipped++;
          continue;
        }

        // Create song
        await prisma.song.create({
          data: {
            title,
            bpm: bpm.toString().trim(),
            originalSinger,
            author,
            style,
            tags,
            nature,
            lyrics: lyrics || null,
          },
        });

        results.success++;
      } catch (error) {
        results.errors.push(
          `Row ${rowNumber}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        );
      }
    }

    return NextResponse.json({
      message: "Import completed",
      results: {
        totalRows: dataRows.length,
        success: results.success,
        skipped: results.skipped,
        errors: results.errors,
      },
    });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 },
    );
  }
}
