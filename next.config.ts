import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Emit a self-contained .next/standalone/server.js with only the traced
	// node_modules, so the Docker runtime image can drop dev deps and source.
	output: "standalone",
	// pg resolves its bindings at runtime, so keep it out of the bundle and let
	// Next's file tracing copy it into the standalone output.
	serverExternalPackages: ["pg", "exceljs"],
	experimental: {
		// The Excel import uploads the workbook through a server action
		// (default limit 1 MB); previewImport itself caps files at 10 MB.
		serverActions: { bodySizeLimit: "11mb" },
	},
};

export default nextConfig;
