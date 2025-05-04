export default function Footer() {
	return (
		< footer className="bg-black text-white text-center py-4 mt-10 border-t border-gray-800">
			<p>
				© 2025 SurfQuest. All Rights Reserved.{' '}
				<a
					href="https://github.com/HolbieWan/surfquest"
					target="_blank"
					rel="noopener noreferer"
					className="text-blue-500 hover:underline"
				>
					View on github
				</a>
			</p>
		</footer>
	);
}