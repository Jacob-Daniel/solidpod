import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	try {
		const { password, passwordConfirmation, code } = await req.json();

		if (!password || !passwordConfirmation || !code) {
			return NextResponse.json(
				{ message: 'Password, password confirmation, and code are required' },
				{ status: 400 },
			);
		}

		if (password !== passwordConfirmation) {
			return NextResponse.json(
				{ message: 'Passwords do not match' },
				{ status: 400 },
			);
		}

		const res = await fetch(
			`${process.env.STRAPI_API_URL}/auth/reset-password`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ password, passwordConfirmation, code }),
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
			message: 'Password has been reset successfully',
		});
	} catch (error) {
		return NextResponse.json({ message: error.message }, { status: 500 });
	}
}
