import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
export async function GET(request: NextRequest) {
	if (
		request.nextUrl.searchParams.get('secret') !== process.env.ISR_API_TOKEN
	) {
		return NextResponse.json({
			revalidated: false,
			now: Date.now(),
			message: 'Invalid token',
		});
	}
	try {
		// console.log(request.nextUrl.searchParams.get('path'));
		if (request.nextUrl.searchParams.get('path')) {
			const path = request.nextUrl.searchParams.get('path') || '/';
			revalidatePath(path);
			console.log(`revalidated true`, 'time:', Date.now(), 'path:', path);
			return NextResponse.json({ revalidated: true, now: Date.now() });
		} else {
			return NextResponse.json({
				message: 'fail',
				path: 'does not exist in request',
			});
		}
	} catch (err) {
		console.log('system error');
		return NextResponse.json({
			message: 'System 500 Error',
		});
	}
}
