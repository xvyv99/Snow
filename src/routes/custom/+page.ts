export function load({ url }) {
	const data = Object.fromEntries(url.searchParams.entries());
	return { props: { data } };
}