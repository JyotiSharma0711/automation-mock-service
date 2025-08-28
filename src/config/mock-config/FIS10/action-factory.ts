import { MockSearchClass } from "./2.1.0/search/class";
import { MockOnSearchClass } from "./2.1.0/on_search/class";
import { MockSelectClass} from "./2.1.0/select/class";
import { MockOnSelectClass } from "./2.1.0/on_select/class";
import { MockInitClass } from "./2.1.0/init/class";
import { MockOnInitClass } from "./2.1.0/on_init/class";
import { MockConfirmClass } from "./2.1.0/confirm/class";
import { MockOnConfirmClass } from "./2.1.0/on_confirm/class";
import { MockUpdateClass } from "./2.1.0/update/class";
import { MockOnUpdateClass } from "./2.1.0/on_update/class";
import { MockOnStatusClass } from "./2.1.0/on_status/class";
import { MockStatusClass } from "./2.1.0/status/class";
import { MockOnCancelClass } from "./2.1.0/on_cancel/class";
import { MockOnStatusUpdateReceiverInfoClass } from "./2.1.0/on_status/on_status_update_receiver_info/class";

export function getMockAction(actionId: string) {
	switch (actionId) {
		case "search":
			return new MockSearchClass();
		case "on_search":
			return new MockOnSearchClass();
		case "select":
			return new MockSelectClass();
		case "on_select":
			return new MockOnSelectClass();
		case "init":
			return new MockInitClass();
		case "on_init":
			return new MockOnInitClass();
		case "confirm":
			return new MockConfirmClass();
		case "on_confirm":
			return new MockOnConfirmClass();
		case "status":
			return new MockStatusClass();
		case "on_status":
			return new MockOnStatusClass();
		case "on_status_update_receiver_info":
			return new MockOnStatusUpdateReceiverInfoClass();
		case "on_cancel":
			return new MockOnCancelClass();
		case "update":
			return new MockUpdateClass();
		case "on_update":
			return new MockOnUpdateClass();
		default:
			throw new Error(`Action with ID ${actionId} not found`);
	}
} 