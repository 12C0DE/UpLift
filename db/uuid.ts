import * as Crypto from "expo-crypto";

export const createUuid = () => Crypto.randomUUID();