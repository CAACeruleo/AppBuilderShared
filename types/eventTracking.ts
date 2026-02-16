/**
 * Properties of tracked events.
 */
export interface IEventTrackingProps {
	/** Namespace (of parameters and exports) */
	namespace: string;
	/** Time spent */
	duration: number;
	/** Type of action */
	action: EventActionEnum;
}

export interface IParameterChangedTrackingProps {
	/** Namespace (of parameters and exports) */
	namespace: string;
	/** Final committed parameter values that were sent for customization */
	values: {[parameterId: string]: unknown};
}

/**
 * Types of actions.
 */
export enum EventActionEnum {
	CUSTOMIZE = "customize",
	EXPORT = "export",
}

/**
 * Interface for event tracking.
 */
export interface IEventTracking {
	onError: (error: any, context?: IEventTrackingProps) => void;
	onSuccess: (context: IEventTrackingProps) => void;
	onParameterChanged?: (context: IParameterChangedTrackingProps) => void;
}
