import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Sample data for the template
    const sampleData = [
      {
        title: "Amazing Grace",
        tone: "G",
        bpm: "80",
        originalSinger: "John Newton",
        author: "John Newton",
        pace: "Slow",
        style: "Traditional Hymn",
        tags: "hymn / traditional / grace",
        nature: "reflective, powerful",
        lyrics:
          "Amazing grace! How sweet the sound\nThat saved a wretch like me!\nI once was lost, but now I'm found;\nWas blind, but now I see.",
      },
      {
        title: "10,000 Reasons",
        tone: "D",
        bpm: "140",
        originalSinger: "Matt Redman",
        author: "Matt Redman",
        pace: "Moderate",
        style: "Contemporary Worship",
        tags: "contemporary / worship / praise",
        nature: "upbeat, joyful",
        lyrics:
          "Bless the Lord, O my soul\nO my soul\nWorship His holy name\nSing like never before\nO my soul\nI'll worship Your holy name",
      },
    ];

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sampleData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Songs Template");

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Create response with proper headers
    const response = new NextResponse(buffer);
    response.headers.set(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    response.headers.set(
      "Content-Disposition",
      "attachment; filename=songs-import-template.xlsx",
    );

    return response;
  } catch (error) {
    console.error("Template generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate template" },
      { status: 500 },
    );
  }
}
