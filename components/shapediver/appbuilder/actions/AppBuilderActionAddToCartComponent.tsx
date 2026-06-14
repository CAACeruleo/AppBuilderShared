import {useNotificationStore} from "@AppBuilderLib/features/notifications";
import AppBuilderActionComponent from "@AppBuilderShared/components/shapediver/appbuilder/actions/AppBuilderActionComponent";
import {useCreateModelState} from "@AppBuilderShared/hooks/shapediver/useCreateModelState";
import {ECommerceApiSingleton} from "@AppBuilderShared/modules/ecommerce/singleton";
import {IAddItemToCartData} from "@AppBuilderShared/modules/ecommerce/types/ecommerceapi";
import {useShapeDiverStoreParameters} from "@AppBuilderShared/store/useShapeDiverStoreParameters";
import {IAppBuilderLegacyActionPropsAddToCart} from "@AppBuilderShared/types/shapediver/appbuilder";
import {EXPORT_TYPE} from "@shapediver/viewer.session";
import React, {useCallback, useState} from "react";

type Props = IAppBuilderLegacyActionPropsAddToCart & {
	namespace: string;
};

// Ceruleo extension of the cart payload. The cross-window transport forwards
// the whole object, so these extra fields reach the portal (useViewerECommerce-
// Connector) and flow into memberCommitJobFromAppV → ingest, where the server
// derives the slicer bundle manifest from the deployment config. Logic mirrors
// the unit-tested helpers in src/ceruleo/slicerBundleCommit.ts (which the shared
// submodule cannot import from the parent app).
type CeruleoCartData = IAddItemToCartData & {
	appvExportUrls?: Record<string, string>;
	dispatchHints?: {slicer?: boolean};
};

/**
 * Functional component for an "addToCart" action.
 *
 * @returns
 */
export default function AppBuilderActionAddToCartComponent(props: Props) {
	const {
		label = "Add to cart",
		icon = "tabler:shopping-cart-plus",
		tooltip,
		namespace,
		productId,
		quantity,
		price,
		description,
		includeImage,
		image,
		includeGltf,
		parameterNamesToInclude,
		parameterNamesToExclude,
	} = props;

	const {createModelState} = useCreateModelState({namespace});

	const getExports = useShapeDiverStoreParameters((state) => state.getExports);

	const notifications = useNotificationStore();

	const [loading, setLoading] = useState(false);

	const onClick = useCallback(async () => {
		setLoading(true);
		// in case we are not running inside an iframe, the instance of
		// IEcommerceApi will be a dummy for testing
		const api = await ECommerceApiSingleton;
		const {
			modelStateId,
			screenshot,
			modelViewUrl,
			modelStateImageUrl,
			modelStateGltfUrl,
			modelStateUsdzUrl,
		} = await createModelState(
			parameterNamesToInclude,
			parameterNamesToExclude,
			includeImage,
			image,
			undefined, // <-- custom data
			includeGltf,
		);

		// Ceruleo: request the model's DOWNLOAD exports for the committed
		// parameter state and forward their URLs so the portal can dispatch a
		// slicer bundle. Best-effort and gated on there being download exports,
		// so pure-display AppV models are unaffected. Keyed by export NAME to
		// match the deployment config slicer consumer's outputId.
		let appvExportUrls: Record<string, string> | undefined;
		try {
			const exportStores = getExports(namespace);
			const collected: Record<string, string> = {};
			await Promise.all(
				Object.values(exportStores).map(async (exportStore) => {
					const exp = exportStore.getState();
					if (exp.definition.type !== EXPORT_TYPE.DOWNLOAD) return;
					try {
						const response = await exp.actions.request();
						const href = response.content?.find((c) => c?.href)?.href;
						if (typeof href === "string" && href.trim().length > 0) {
							collected[exp.definition.name] = href;
						}
					} catch {
						// best-effort: a failed export contributes no URL
					}
				}),
			);
			if (Object.keys(collected).length > 0) {
				appvExportUrls = collected;
			}
		} catch {
			// best-effort: never block the cart add on export collection
		}

		const cartData: CeruleoCartData = {
			modelStateId,
			productId,
			quantity,
			price,
			description,
			imageUrl: screenshot,
			modelViewUrl,
			modelStateImageUrl,
			modelStateGltfUrl,
			modelStateUsdzUrl,
			...(appvExportUrls
				? {appvExportUrls, dispatchHints: {slicer: true}}
				: {}),
		};
		try {
			const result = await api.addItemToCart(cartData);
			// TODO display modal instead of notification, offer possibility to hide configurator
			notifications.success({
				message: `An item for configuration ID ${modelStateId} has been added to the cart (cart item id ${result.id}).`,
			});
		} catch (e) {
			notifications.error({
				message: `An error happened while adding configuration ID ${modelStateId} to the cart.`,
			});
			// TODO report error to sentry
			throw e;
		} finally {
			setLoading(false);
		}
	}, [
		productId,
		quantity,
		price,
		description,
		parameterNamesToInclude,
		parameterNamesToExclude,
		image,
		includeImage,
		includeGltf,
		namespace,
		getExports,
	]);

	return (
		<AppBuilderActionComponent
			label={label}
			icon={icon}
			tooltip={tooltip}
			onClick={onClick}
			loading={loading}
		/>
	);
}
