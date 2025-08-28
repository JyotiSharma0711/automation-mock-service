import fs from "fs";
import yaml from "js-yaml";
import { RedisService } from "ondc-automation-cache-lib";
import jsonpath from "jsonpath";

import { logger } from "../utils/logger";
import { isArrayKey } from "../types/type-utils";
import {
	defaultSessionData,
	getSaveDataContent,
	MockSessionData,
} from "../config/mock-config";

export function updateSessionData(
	saveData: Record<string, string>,
	payload: any,
	sessionData: MockSessionData,
	errorData?: {
		code: number;
		message: string;
	}
) {
	logger.info(`updating session`);
	try {
		for (const key in saveData) {
			const jsonPath = saveData[key as keyof typeof saveData];
			const result = jsonpath.query(payload, jsonPath);
			logger.debug(`updating ${key} for path $${jsonPath}`);
			if (
				isArrayKey<MockSessionData>(
					key as keyof typeof sessionData,
					sessionData
				)
			) {
				sessionData[key as keyof typeof sessionData] = result;
			} else {
				sessionData[key as keyof typeof sessionData] = result[0];
			}
		}
		if (errorData) {
			console.log("errorData", errorData);
			sessionData.error_code = errorData.code.toString();
			sessionData.error_message = errorData.message;
		} else {
			sessionData.error_code = undefined;
			sessionData.error_message = undefined;
		}
	} catch (e) {
		logger.error("Error in updating session data", e);
	}
}

export async function saveData(
	action: string,
	payload: any,
	errorData?: {
		code: number;
		message: string;
	}
) {
	try {
		const sessionData = await loadMockSessionData(
			payload?.context.transaction_id
		);
		// Extract domain from payload context or session data
		let domain = payload?.context?.domain || sessionData.domain || process.env.DOMAIN || "ONDC:FIS10";
		console.log("data-services - payload.context.domain:", payload?.context?.domain);
		console.log("data-services - sessionData.domain:", sessionData.domain);
		console.log("data-services - process.env.DOMAIN:", process.env.DOMAIN);
		console.log("data-services - extracted domain:", domain);
		
		// Validate and normalize domain
		switch (domain) {
			case "ONDC:FIS14":
			case "ONDC:TRV14":
			case "ONDC:FIS10":
				// Valid domains, keep as is
				break;
			default:
				// Unknown domain, default to FIS10
				domain = "ONDC:FIS10";
				break;
		}
		const saveData = getSaveDataContent(
			payload?.context?.version || payload?.context?.core_version,
			action
		);
		updateSessionData(saveData["save-data"], payload, sessionData, errorData);
		await RedisService.setKey(
			payload?.context.transaction_id,
			JSON.stringify(sessionData)
		);
		logger.info("Data saved to session");
	} catch (e) {
		logger.error("Error in saving data to session", e);
	}
}

export async function saveDataForConfig(
	saveData: {
		"save-data": Record<string, string>;
	},
	payload: any,
	errorData?: {
		code: number;
		message: string;
	}
) {
	try {
		const sessionData = await loadMockSessionData(
			payload?.context.transaction_id
		);
		updateSessionData(saveData["save-data"], payload, sessionData, errorData);
		await RedisService.setKey(
			payload?.context.transaction_id,
			JSON.stringify(sessionData)
		);
		logger.info("Data saved to session");
	} catch (e) {
		logger.error("Error in saving data to session", e);
	}
}

export async function loadMockSessionData(
	transactionID: string,
	subscriber_url?: string
) {
	const keyExists = await RedisService.keyExists(transactionID);
	let sessionData: MockSessionData = {} as MockSessionData;
	if (!keyExists) {
		// Extract domain from environment or use FIS10 as default for testing
		const domain = process.env.DOMAIN || "ONDC:FIS10";
		console.log("loadMockSessionData - creating new session with domain:", domain);
		
		const raw = defaultSessionData();
		sessionData = raw.session_data;
		sessionData.transaction_id = transactionID;
		sessionData.bpp_id = sessionData.bap_id = "dev-automation.ondc.org";
		sessionData.bap_uri = "https://dev-automation.ondc.org/buyer";
		sessionData.bpp_uri = "https://dev-automation.ondc.org/seller";
		sessionData.subscriber_url = subscriber_url;
		sessionData.domain = domain;
		logger.info(`new session data is ${JSON.stringify(sessionData)}`);
		return sessionData;
	} else {
		const rawData = await RedisService.getKey(transactionID);
		logger.info(`loading session data for ${transactionID}`);
		const sessionData = JSON.parse(rawData ?? "{}") as MockSessionData;
		console.log("loadMockSessionData - loaded existing session with domain:", sessionData.domain);
		return sessionData;
	}
}
