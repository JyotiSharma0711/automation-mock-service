import { readFileSync } from "fs";
import { logger } from "../../utils/logger";
import path from "path";
import yaml from "js-yaml";
import { SessionData as MockSessionData } from "./TRV14/session-types";
import { createMockResponse as createTRV14MockResponse } from "./TRV14/version-factory";
import { getMockAction as getTRV14MockAction } from "./TRV14/action-factory";
import { createMockResponse as createFIS14MockResponse } from "./FIS14/version-factory";
import { getMockAction as getFIS14MockAction } from "./FIS14/action-factory";
import { createMockResponse as createFIS10MockResponse } from "./FIS10/version-factory";
import { getMockAction as getFIS10MockAction } from "./FIS10/action-factory";

export { MockSessionData };

// Default to FIS10 for testing
const defaultDomain = process.env.DOMAIN || "ONDC:FIS10";

const actionConfigs = {
	TRV14: yaml.load(
		readFileSync(path.join(__dirname, "./TRV14/factory.yaml"), "utf8")
	) as any,
	FIS14: yaml.load(
		readFileSync(path.join(__dirname, "./FIS14/factory.yaml"), "utf8")
	) as any,
	FIS10: yaml.load(
		readFileSync(path.join(__dirname, "./FIS10/factory.yaml"), "utf8")
	) as any,
};

export const defaultSessionData = (domain: string = defaultDomain) => {
	let sessionDataPath: string;
	console.log("domain>>>>>>>>>>>", domain);
	switch (domain) {
		case "ONDC:FIS14":
			sessionDataPath = path.join(__dirname, `./FIS14/session-data.yaml`);
			break;
		case "ONDC:FIS10":
			sessionDataPath = path.join(__dirname, `./FIS10/session-data.yaml`);
			break;
		case "ONDC:TRV14":
			sessionDataPath = path.join(__dirname, `./TRV14/session-data.yaml`);
			break;
		default:
			sessionDataPath = path.join(__dirname, `./${domain}/session-data.yaml`);
			break;
	}
	
	return yaml.load(readFileSync(sessionDataPath, "utf8")) as { session_data: MockSessionData };
};

export async function generateMockResponse(
	session_id: string,
	sessionData: any,
	action_id: string,
	input?: any,
	domain: string = defaultDomain
) {
	try {
		console.log("generateMockResponse - action_id:", action_id);
		console.log("generateMockResponse - domain:", domain);
		console.log("generateMockResponse - defaultDomain:", defaultDomain);
		console.log("generateMockResponse - sessionData", sessionData);
		
		let response;
		switch (domain) {
			case "ONDC:FIS14":
				response = await createFIS14MockResponse(
					session_id,
					sessionData,
					action_id,
					input
				);
				break;
			case "ONDC:FIS10":
				response = await createFIS10MockResponse(
					session_id,
					sessionData,
					action_id,
					input
				);
				break;
			case "ONDC:TRV14":
			default:
				response = await createTRV14MockResponse(
					session_id,
					sessionData,
					action_id,
					input
				);
				break;
		}
		
		response.context.timestamp = new Date().toISOString();
		return response;
	} catch (e) {
		logger.error("Error in generating mock response", e);
		throw e;
	}
}

export function getMockActionObject(actionId: string, domain: string = defaultDomain) {
	switch (domain) {
		case "ONDC:FIS14":
			return getFIS14MockAction(actionId);
		case "ONDC:FIS10":
			return getFIS10MockAction(actionId);
		case "ONDC:TRV14":
		default:
			return getTRV14MockAction(actionId);
	}
}

export function getActionData(code: number, domain: string = defaultDomain) {
	const actionConfig = actionConfigs[domain as keyof typeof actionConfigs];
	if (!actionConfig) {
		throw new Error(`Domain ${domain} not supported`);
	}
	
	const actionData = actionConfig.codes.find(
		(action: any) => action.code === code
	);
	if (actionData) {
		return actionData;
	}
	throw new Error(`Action code ${code} not found for domain ${domain}`);
}

export function getSaveDataContent(version: string, action: string, domain: string = defaultDomain) {
	let actionFolderPath: string;
	
	switch (domain) {
		case "ONDC:FIS14":
		case "ONDC:TRV14":
		case "ONDC:FIS10":
		default:
			actionFolderPath = path.resolve(
				__dirname,
				`./${domain}/${version}/${action}`
			);
			break;
	}
	
	const saveDataFilePath = path.join(actionFolderPath, "save-data.yaml");
	const fileContent = readFileSync(saveDataFilePath, "utf8");
	const cont = yaml.load(fileContent) as any;
	console.log(cont);
	return cont;
}
