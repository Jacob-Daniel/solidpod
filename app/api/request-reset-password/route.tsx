import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const { email } = await req.json();

		if (!email) {
			return NextResponse.json(
				{ message: 'Email is required' },
				{ status: 400 },
			);
		}

		const res = await fetch(
			`${process.env.STRAPI_API_URL}/auth/forgot-password`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			},
		);

		const data = await res.json();

		if (data.error) {
			return NextResponse.json(
				{ message: data.error.message },
				{ status: 400 },
			);
		}

		return NextResponse.json({
			message: 'Password reset email sent successfully',
		});
	} catch (error) {
		return NextResponse.json({ message: error.message }, { status: 500 });
	}
}
