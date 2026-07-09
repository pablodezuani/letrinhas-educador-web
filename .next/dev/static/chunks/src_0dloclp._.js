(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/services/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
// Aponta para o backend em produção por padrão — o app é aberto no navegador
// do celular, então não há como alcançar um host local tipo 10.0.2.2.
// Sobrescreva com NEXT_PUBLIC_API_URL em .env.local para apontar para um backend local.
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL ?? 'https://letrinhas-encantadas-back.vercel.app',
    timeout: 10000
});
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthContext",
    ()=>AuthContext,
    "AuthProvider",
    ()=>AuthProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const EMPTY_USER = {
    id: '',
    name: '',
    email: '',
    token: ''
};
const STORAGE_KEY = '@coinDezuToken';
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(EMPTY_USER);
    const [loadingAuth, setLoadingAuth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const isAuthenticated = !!user.token;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const raw = localStorage.getItem(STORAGE_KEY);
            const hasUser = raw ? JSON.parse(raw) : EMPTY_USER;
            if (hasUser?.token) {
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].defaults.headers.common['Authorization'] = `Bearer ${hasUser.token}`;
                setUser(hasUser);
            }
            setLoading(false);
        }
    }["AuthProvider.useEffect"], []);
    async function signIn({ email, password }) {
        setLoadingAuth(true);
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/session', {
                email,
                password
            });
            const { id, name, token } = response.data;
            const data = {
                id,
                name,
                email,
                token
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(data);
        } catch (err) {
            throw new Error(err.response?.data?.error || err.response?.data?.message || 'Erro ao fazer login');
        } finally{
            setLoadingAuth(false);
        }
    }
    async function signUp({ name, email, password }) {
        setLoadingAuth(true);
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/users', {
                name,
                email,
                password
            });
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/session', {
                email,
                password
            });
            const { id, name: userName, token } = response.data;
            const data = {
                id,
                name: userName,
                email,
                token
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(data);
        } catch (err) {
            throw new Error(err.response?.data?.error || err.response?.data?.message || 'Erro ao cadastrar');
        } finally{
            setLoadingAuth(false);
        }
    }
    function signOut() {
        localStorage.clear();
        delete __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].defaults.headers.common['Authorization'];
        setUser(EMPTY_USER);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            isAuthenticated,
            signIn,
            signUp,
            loading,
            loadingAuth,
            signOut
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/AuthContext.tsx",
        lineNumber: 107,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "Md9+SD4rh0ZVPc+tDXmxlZr104s=");
_c = AuthProvider;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/contexts/SettingsContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SettingsContext",
    ()=>SettingsContext,
    "SettingsProvider",
    ()=>SettingsProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const STORAGE_KEY = '@letrinhas:settings';
const DEFAULT_SETTINGS = {
    darkMode: false,
    notificationsEnabled: true,
    notificationSound: true,
    soundEnabled: true,
    cameraEnabled: true,
    lowStimulationMode: false,
    reduceMotion: false
};
const SettingsContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function SettingsProvider({ children }) {
    _s();
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_SETTINGS);
    const [hydrated, setHydrated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SettingsProvider.useEffect": ()=>{
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    setSettings({
                        ...DEFAULT_SETTINGS,
                        ...parsed
                    });
                }
            } catch (err) {
                console.warn('[SettingsContext] falha ao carregar settings:', err);
            } finally{
                setHydrated(true);
            }
        }
    }["SettingsProvider.useEffect"], []);
    const persist = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SettingsProvider.useCallback[persist]": (next)=>{
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            } catch (err) {
                console.warn('[SettingsContext] falha ao persistir settings:', err);
            }
        }
    }["SettingsProvider.useCallback[persist]"], []);
    const updateSetting = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SettingsProvider.useCallback[updateSetting]": (key, value)=>{
            setSettings({
                "SettingsProvider.useCallback[updateSetting]": (prev)=>{
                    const next = {
                        ...prev,
                        [key]: value
                    };
                    persist(next);
                    return next;
                }
            }["SettingsProvider.useCallback[updateSetting]"]);
        }
    }["SettingsProvider.useCallback[updateSetting]"], [
        persist
    ]);
    const toggle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SettingsProvider.useCallback[toggle]": (key)=>{
            setSettings({
                "SettingsProvider.useCallback[toggle]": (prev)=>{
                    const next = {
                        ...prev,
                        [key]: !prev[key]
                    };
                    persist(next);
                    return next;
                }
            }["SettingsProvider.useCallback[toggle]"]);
        }
    }["SettingsProvider.useCallback[toggle]"], [
        persist
    ]);
    const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SettingsProvider.useCallback[reset]": ()=>{
            setSettings(DEFAULT_SETTINGS);
            persist(DEFAULT_SETTINGS);
        }
    }["SettingsProvider.useCallback[reset]"], [
        persist
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SettingsProvider.useMemo[value]": ()=>({
                settings,
                hydrated,
                updateSetting,
                toggle,
                reset
            })
    }["SettingsProvider.useMemo[value]"], [
        settings,
        hydrated,
        updateSetting,
        toggle,
        reset
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SettingsContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/SettingsContext.tsx",
        lineNumber: 105,
        columnNumber: 10
    }, this);
}
_s(SettingsProvider, "6gwMgt3pjOxlTmt0FzYXQzUDiNs=");
_c = SettingsProvider;
var _c;
__turbopack_context__.k.register(_c, "SettingsProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/theme/colors.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Paleta pastel acolhedora pensada para crianças com TEA (níveis 1, 2 e 3).
 * Ported 1:1 from the React Native app's theme/colors.ts.
 * Keep in sync with the `--color-*` variables in src/index.css.
 */ __turbopack_context__.s([
    "colors",
    ()=>colors,
    "default",
    ()=>__TURBOPACK__default__export__
]);
const colors = {
    // Base / neutros
    background: '#FFF8F4',
    surface: '#FFFFFF',
    surfaceAlt: '#F6EEE6',
    surfaceMuted: '#F1E9DF',
    overlay: 'rgba(48, 95, 114, 0.45)',
    overlayLight: 'rgba(48, 95, 114, 0.18)',
    // Primárias (Teal suave) — marca, headers, ações
    primary: '#305F72',
    primaryLight: '#567B8B',
    primaryDark: '#1F4352',
    primarySoft: 'rgba(48, 95, 114, 0.08)',
    // Secundárias (Lilás suave) — CTA primário
    secondary: '#CBAACB',
    secondaryLight: '#E2CDE2',
    secondaryDark: '#A988A9',
    secondarySoft: 'rgba(203, 170, 203, 0.18)',
    // Acento (Pêssego) — destaques, badges, branding
    accent: '#F5A97C',
    accentLight: '#FAC7A6',
    accentDark: '#D48660',
    accentSoft: 'rgba(245, 169, 124, 0.18)',
    // Semânticos (suaves, com versão "Light" para fundos)
    success: '#7FB77E',
    successLight: '#E4F1E3',
    successDark: '#5C9A5B',
    warning: '#E9B44C',
    warningLight: '#FBEED1',
    warningDark: '#B98A2D',
    error: '#D9756B',
    errorLight: '#FBE5E2',
    errorDark: '#B85048',
    info: '#6DAED9',
    infoLight: '#DBEDF7',
    infoDark: '#4D8AB2',
    // Texto
    textPrimary: '#305F72',
    textSecondary: '#6B7F88',
    textMuted: '#98A5AB',
    textDisabled: '#C2C8CB',
    textOnPrimary: '#FFF8F4',
    textOnSecondary: '#FFFFFF',
    textOnAccent: '#4A1B0C',
    // Bordas e divisores
    border: 'rgba(48, 95, 114, 0.12)',
    borderStrong: 'rgba(48, 95, 114, 0.25)',
    borderFocus: '#305F72',
    divider: 'rgba(48, 95, 114, 0.08)',
    // Utilitários
    transparent: 'transparent',
    white: '#FFFFFF',
    black: '#000000',
    shadow: '#000000',
    // Níveis TEA (suavizados, sem alarmismo)
    teaLevel1: '#7FB77E',
    teaLevel1Light: '#E4F1E3',
    teaLevel2: '#E9B44C',
    teaLevel2Light: '#FBEED1',
    teaLevel3: '#D9756B',
    teaLevel3Light: '#FBE5E2',
    // Temas suaves de gênero (para personalização das crianças)
    boy: '#6DAED9',
    boyLight: '#DBEDF7',
    boyDark: '#4D8AB2',
    girl: '#E8A7BD',
    girlLight: '#F7E0E8',
    girlDark: '#C5879B'
};
const __TURBOPACK__default__export__ = colors;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/theme/gradients.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Tuplas de cores para gradientes. Em modo "baixo estímulo" (lowStimulationMode)
 * o ThemeContext acha por bem achatar para a primeira cor da tupla.
 * Use `gradientCss(token)` para obter a string CSS `linear-gradient(...)`.
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "gradientCss",
    ()=>gradientCss,
    "gradients",
    ()=>gradients
]);
const gradients = {
    primary: [
        '#305F72',
        '#567B8B'
    ],
    primaryDeep: [
        '#1F4352',
        '#305F72'
    ],
    secondary: [
        '#CBAACB',
        '#E2CDE2'
    ],
    accent: [
        '#F5A97C',
        '#FAC7A6'
    ],
    success: [
        '#7FB77E',
        '#A8CEA7'
    ],
    warning: [
        '#E9B44C',
        '#F3CC7F'
    ],
    error: [
        '#D9756B',
        '#E89990'
    ],
    info: [
        '#6DAED9',
        '#A4CDE5'
    ],
    soft: [
        '#FFF8F4',
        '#F6EEE6'
    ],
    cream: [
        '#FFFFFF',
        '#FFF8F4'
    ],
    boy: [
        '#DBEDF7',
        '#B9D9EA',
        '#6DAED9'
    ],
    girl: [
        '#F7E0E8',
        '#EEBFCD',
        '#E8A7BD'
    ],
    sunset: [
        '#FAC7A6',
        '#E8A7BD'
    ],
    ocean: [
        '#B9D9EA',
        '#567B8B'
    ],
    candy: [
        '#CBAACB',
        '#F5A97C'
    ]
};
function gradientCss(colorsOrToken, angle = 135) {
    const stops = Array.isArray(colorsOrToken) ? colorsOrToken : gradients[colorsOrToken];
    return `linear-gradient(${angle}deg, ${stops.join(', ')})`;
}
const __TURBOPACK__default__export__ = gradients;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/theme/typography.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Pacifico  → branding (logo, títulos especiais).
 * Nunito    → fonte funcional (todo o resto). Carregadas via Google Fonts em index.html.
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "fontFamily",
    ()=>fontFamily,
    "fontWeight",
    ()=>fontWeight,
    "typography",
    ()=>typography
]);
const fontWeight = {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700
};
const fontFamily = {
    display: "'Pacifico', cursive",
    regular: "'Nunito', sans-serif",
    medium: "'Nunito', sans-serif",
    semibold: "'Nunito', sans-serif",
    bold: "'Nunito', sans-serif"
};
const typography = {
    display: {
        fontFamily: fontFamily.display,
        fontWeight: fontWeight.regular,
        fontSize: 40,
        lineHeight: 48,
        letterSpacing: 0.5
    },
    h1: {
        fontFamily: fontFamily.bold,
        fontWeight: fontWeight.bold,
        fontSize: 28,
        lineHeight: 34,
        letterSpacing: -0.2
    },
    h2: {
        fontFamily: fontFamily.bold,
        fontWeight: fontWeight.bold,
        fontSize: 22,
        lineHeight: 28
    },
    h3: {
        fontFamily: fontFamily.semibold,
        fontWeight: fontWeight.semibold,
        fontSize: 18,
        lineHeight: 24
    },
    subtitle: {
        fontFamily: fontFamily.semibold,
        fontWeight: fontWeight.semibold,
        fontSize: 16,
        lineHeight: 22
    },
    body: {
        fontFamily: fontFamily.regular,
        fontWeight: fontWeight.regular,
        fontSize: 15,
        lineHeight: 22
    },
    bodyStrong: {
        fontFamily: fontFamily.semibold,
        fontWeight: fontWeight.semibold,
        fontSize: 15,
        lineHeight: 22
    },
    bodySmall: {
        fontFamily: fontFamily.regular,
        fontWeight: fontWeight.regular,
        fontSize: 13,
        lineHeight: 20
    },
    caption: {
        fontFamily: fontFamily.medium,
        fontWeight: fontWeight.medium,
        fontSize: 12,
        lineHeight: 16
    },
    label: {
        fontFamily: fontFamily.semibold,
        fontWeight: fontWeight.semibold,
        fontSize: 11,
        lineHeight: 14,
        letterSpacing: 1.2,
        textTransform: 'uppercase'
    },
    button: {
        fontFamily: fontFamily.semibold,
        fontWeight: fontWeight.semibold,
        fontSize: 16,
        lineHeight: 20,
        letterSpacing: 0.3
    },
    buttonSmall: {
        fontFamily: fontFamily.semibold,
        fontWeight: fontWeight.semibold,
        fontSize: 14,
        lineHeight: 18,
        letterSpacing: 0.2
    }
};
const __TURBOPACK__default__export__ = typography;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/theme/spacing.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Escala de espaçamento (4px base). Valores em px. */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "spacing",
    ()=>spacing
]);
const spacing = {
    none: 0,
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
    massive: 56
};
const __TURBOPACK__default__export__ = spacing;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/theme/radius.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Raios de borda. Valores em px. */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "radius",
    ()=>radius
]);
const radius = {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 28,
    pill: 999
};
const __TURBOPACK__default__export__ = radius;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/theme/shadows.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "shadows",
    ()=>shadows
]);
/** Sombras (CSS box-shadow). Opacidade moderada para preservar a sensação calmante do app. */ const create = (offsetY, opacity, blur)=>`0 ${offsetY}px ${blur}px rgba(0, 0, 0, ${opacity})`;
const shadows = {
    none: 'none',
    sm: create(1, 0.06, 2),
    md: create(2, 0.1, 4),
    lg: create(4, 0.14, 8),
    xl: create(8, 0.2, 16)
};
const __TURBOPACK__default__export__ = shadows;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/theme/animation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Durações padrão (ms). Sempre lidas via useReduceMotion() — quando o usuário
 * prefere menos movimento, as durações efetivas vão para 0.
 */ __turbopack_context__.s([
    "animation",
    ()=>animation,
    "default",
    ()=>__TURBOPACK__default__export__,
    "easing",
    ()=>easing
]);
const animation = {
    fast: 150,
    normal: 250,
    slow: 400,
    lazy: 600,
    splash: 1200
};
const easing = {
    standard: [
        0.25,
        0.1,
        0.25,
        1
    ],
    decelerate: [
        0.0,
        0.0,
        0.2,
        1
    ],
    accelerate: [
        0.4,
        0.0,
        1,
        1
    ],
    bounce: [
        0.34,
        1.56,
        0.64,
        1
    ]
};
const __TURBOPACK__default__export__ = animation;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/theme/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "theme",
    ()=>theme
]);
/**
 * Reexporta todos os tokens do design system. Importe daqui:
 *
 *   import { colors, spacing, typography } from '@/theme'
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$colors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/theme/colors.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$gradients$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/theme/gradients.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$typography$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/theme/typography.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$spacing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/theme/spacing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$radius$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/theme/radius.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$shadows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/theme/shadows.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$animation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/theme/animation.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const theme = {
    colors: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$colors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colors"],
    gradients: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$gradients$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["gradients"],
    fontFamily: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$typography$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fontFamily"],
    fontWeight: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$typography$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fontWeight"],
    typography: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$typography$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["typography"],
    spacing: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$spacing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["spacing"],
    radius: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$radius$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["radius"],
    shadows: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$shadows$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["shadows"],
    animation: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$animation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["animation"],
    easing: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$animation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["easing"]
};
const __TURBOPACK__default__export__ = theme;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useSettings.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSettings",
    ()=>useSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/SettingsContext.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function useSettings() {
    _s();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsContext"]);
    if (!ctx) {
        throw new Error('useSettings deve ser usado dentro de <SettingsProvider>.');
    }
    return ctx;
}
_s(useSettings, "/dMy7t63NXD4eYACoT93CePwGrg=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/contexts/ThemeContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useLowStimulation",
    ()=>useLowStimulation,
    "useReduceMotion",
    ()=>useReduceMotion,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/theme/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSettings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useSettings.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
'use client';
;
;
;
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function fallbackValue() {
    return {
        theme: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["theme"],
        reduceMotion: false,
        lowStimulationMode: false,
        motionDuration: (ms)=>ms,
        resolveGradient: (g)=>g
    };
}
function ThemeProvider({ children }) {
    _s();
    const { settings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSettings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettings"])();
    const [systemReduceMotion, setSystemReduceMotion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            const query = window.matchMedia('(prefers-reduced-motion: reduce)');
            setSystemReduceMotion(query.matches);
            const listener = {
                "ThemeProvider.useEffect.listener": (e)=>setSystemReduceMotion(e.matches)
            }["ThemeProvider.useEffect.listener"];
            query.addEventListener('change', listener);
            return ({
                "ThemeProvider.useEffect": ()=>query.removeEventListener('change', listener)
            })["ThemeProvider.useEffect"];
        }
    }["ThemeProvider.useEffect"], []);
    const reduceMotion = systemReduceMotion || settings.reduceMotion;
    const lowStimulationMode = settings.lowStimulationMode;
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ThemeProvider.useMemo[value]": ()=>({
                theme: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["theme"],
                reduceMotion,
                lowStimulationMode,
                motionDuration: ({
                    "ThemeProvider.useMemo[value]": (ms)=>reduceMotion ? 0 : ms
                })["ThemeProvider.useMemo[value]"],
                resolveGradient: ({
                    "ThemeProvider.useMemo[value]": (gradient)=>lowStimulationMode ? [
                            gradient[0],
                            gradient[0]
                        ] : gradient
                })["ThemeProvider.useMemo[value]"]
            })
    }["ThemeProvider.useMemo[value]"], [
        reduceMotion,
        lowStimulationMode
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/ThemeContext.tsx",
        lineNumber: 61,
        columnNumber: 10
    }, this);
}
_s(ThemeProvider, "7/uxja8CqudQGsxpn7B8adQNiVA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useSettings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettings"]
    ];
});
_c = ThemeProvider;
function useTheme() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
    return ctx ?? fallbackValue();
}
_s1(useTheme, "/dMy7t63NXD4eYACoT93CePwGrg=");
function useReduceMotion() {
    _s2();
    return useTheme().reduceMotion;
}
_s2(useReduceMotion, "tFi1QeP7MrrEQ5RfFlomBKZonOc=", false, function() {
    return [
        useTheme
    ];
});
function useLowStimulation() {
    _s3();
    return useTheme().lowStimulationMode;
}
_s3(useLowStimulation, "tFi1QeP7MrrEQ5RfFlomBKZonOc=", false, function() {
    return [
        useTheme
    ];
});
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/feedback/Toast.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToastProvider",
    ()=>ToastProvider,
    "default",
    ()=>__TURBOPACK__default__export__,
    "useToast",
    ()=>useToast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.mjs [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.mjs [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.mjs [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/theme/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$colors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/theme/colors.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/ThemeContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
;
;
const ToastContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const ICON = {
    success: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"],
    error: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"],
    info: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"],
    warning: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"]
};
const FG = {
    success: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$colors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colors"].successDark,
    error: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$colors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colors"].errorDark,
    info: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$colors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colors"].infoDark,
    warning: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$colors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colors"].warningDark
};
const BG = {
    success: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$colors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colors"].successLight,
    error: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$colors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colors"].errorLight,
    info: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$colors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colors"].infoLight,
    warning: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$theme$2f$colors$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["colors"].warningLight
};
function ToastProvider({ children }) {
    _s();
    const [toast, setToast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const reduceMotion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReduceMotion"])();
    const idRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const hideTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dismiss = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ToastProvider.useCallback[dismiss]": ()=>setToast(null)
    }["ToastProvider.useCallback[dismiss]"], []);
    const show = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ToastProvider.useCallback[show]": (message, opts)=>{
            const variant = opts?.variant ?? 'info';
            const duration = opts?.duration ?? 2400;
            idRef.current += 1;
            const id = idRef.current;
            setToast({
                id,
                message,
                variant,
                duration
            });
            if (hideTimer.current) clearTimeout(hideTimer.current);
            hideTimer.current = setTimeout({
                "ToastProvider.useCallback[show]": ()=>{
                    if (idRef.current === id) dismiss();
                }
            }["ToastProvider.useCallback[show]"], duration);
        }
    }["ToastProvider.useCallback[show]"], [
        dismiss
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ToastProvider.useMemo[value]": ()=>({
                show,
                success: ({
                    "ToastProvider.useMemo[value]": (m, d)=>show(m, {
                            variant: 'success',
                            duration: d
                        })
                })["ToastProvider.useMemo[value]"],
                error: ({
                    "ToastProvider.useMemo[value]": (m, d)=>show(m, {
                            variant: 'error',
                            duration: d
                        })
                })["ToastProvider.useMemo[value]"],
                info: ({
                    "ToastProvider.useMemo[value]": (m, d)=>show(m, {
                            variant: 'info',
                            duration: d
                        })
                })["ToastProvider.useMemo[value]"],
                warning: ({
                    "ToastProvider.useMemo[value]": (m, d)=>show(m, {
                            variant: 'warning',
                            duration: d
                        })
                })["ToastProvider.useMemo[value]"]
            })
    }["ToastProvider.useMemo[value]"], [
        show
    ]);
    const Icon = toast ? ICON[toast.variant] : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToastContext.Provider, {
        value: value,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed left-lg right-lg z-[1000] flex justify-center pointer-events-none top-[calc(env(safe-area-inset-top)+8px)]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                    children: toast && Icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            y: reduceMotion ? 0 : -80,
                            opacity: 0
                        },
                        animate: {
                            y: 0,
                            opacity: 1
                        },
                        exit: {
                            y: reduceMotion ? 0 : -80,
                            opacity: 0
                        },
                        transition: {
                            duration: reduceMotion ? 0 : 0.28
                        },
                        role: "alert",
                        "aria-live": "polite",
                        className: "flex items-center py-md px-lg rounded-lg min-w-[200px] max-w-[480px] shadow-lg pointer-events-auto",
                        style: {
                            backgroundColor: BG[toast.variant]
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                size: 18,
                                color: FG[toast.variant],
                                className: "mr-sm shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/src/components/feedback/Toast.tsx",
                                lineNumber: 104,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-body-small font-semibold",
                                style: {
                                    color: FG[toast.variant]
                                },
                                children: toast.message
                            }, void 0, false, {
                                fileName: "[project]/src/components/feedback/Toast.tsx",
                                lineNumber: 105,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/feedback/Toast.tsx",
                        lineNumber: 94,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/feedback/Toast.tsx",
                    lineNumber: 92,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/feedback/Toast.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/feedback/Toast.tsx",
        lineNumber: 89,
        columnNumber: 5
    }, this);
}
_s(ToastProvider, "vnyM3NoRF5cRDoAxHnMetBrNAlk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReduceMotion"]
    ];
});
_c = ToastProvider;
function useToast() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ToastContext);
    if (!ctx) {
        const noop = ()=>{};
        return {
            show: noop,
            success: noop,
            error: noop,
            info: noop,
            warning: noop
        };
    }
    return ctx;
}
_s1(useToast, "/dMy7t63NXD4eYACoT93CePwGrg=");
const __TURBOPACK__default__export__ = ToastProvider;
var _c;
__turbopack_context__.k.register(_c, "ToastProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/SettingsContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/ThemeContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$feedback$2f$Toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/feedback/Toast.tsx [app-client] (ecmascript)");
'use client';
;
;
;
;
;
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SettingsContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$feedback$2f$Toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastProvider"], {
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/app/providers.tsx",
                    lineNumber: 14,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/providers.tsx",
                lineNumber: 13,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/providers.tsx",
            lineNumber: 12,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/providers.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0dloclp._.js.map