import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { userId, clinic_code } = await request.json()

    if (!userId || !clinic_code) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    const supabaseAdmin = createAdminClient()

    // Update user metadata to include admin role
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        role: "admin",
        clinic_code,
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
