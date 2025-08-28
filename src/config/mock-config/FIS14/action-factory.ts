import { search_seller_full_pull_class } from "./2.1.0/search/search_full_pull/class";
import { MockOnSearchSellerFullPullClass } from "./2.1.0/on_search/on_search_full_pull/class";
import { search_incremental_pull_class } from "./2.1.0/search/search_incremental_pull/class";
import { MockOnSearchIncrementalPullClass } from "./2.1.0/on_search/on_search_incremental_pull/class";

export function getMockAction(actionId: string) {
	console.log("actionId>>>>>>>>>>>", actionId);
	switch (actionId) {
		case "search_full_pull":
			return new search_seller_full_pull_class();
		case "on_search_full_pull":
			return new MockOnSearchSellerFullPullClass();
		case "search_incremental_pull":
			return new search_incremental_pull_class();
		case "on_search_incremental_pull":
			return new MockOnSearchIncrementalPullClass();
		default:
			throw new Error(`Action with ID ${actionId} not found`);
	}
} 