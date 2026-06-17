if (!Array.prototype.toReversed) {
	Object.defineProperty(Array.prototype, "toReversed", {
		value: function toReversedPolyfill() {
			return this.slice().reverse();
		},
		writable: true,
		configurable: true,
	});
}

if (!Array.prototype.toSorted) {
	Object.defineProperty(Array.prototype, "toSorted", {
		value: function toSortedPolyfill(compareFn) {
			return this.slice().sort(compareFn);
		},
		writable: true,
		configurable: true,
	});
}

const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("sql");

module.exports = config;
