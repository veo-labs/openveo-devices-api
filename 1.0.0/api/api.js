YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "DeviceError",
        "DevicePilot",
        "DeviceSocketController",
        "DevicesApiPlugin",
        "DevicesApiPluginApi",
        "TYPES",
        "VEOBOX_MESSAGES",
        "VEOBOX_STATUSES",
        "VeoboxController",
        "VeoboxPilot",
        "devicesPilotsManager",
        "factory"
    ],
    "modules": [
        "controllers",
        "devices",
        "devices-api"
    ],
    "allModules": [
        {
            "displayName": "controllers",
            "name": "controllers",
            "description": "Include all plugin's controllers to handle HTTP or socket messages."
        },
        {
            "displayName": "devices",
            "name": "devices",
            "description": "All supported devices with their associated pilots."
        },
        {
            "displayName": "devices-api",
            "name": "devices-api"
        }
    ],
    "elements": []
} };
});