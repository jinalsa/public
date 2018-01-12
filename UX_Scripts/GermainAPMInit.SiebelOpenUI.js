GermainAPM.init({
    beacon_url: 'http://${domain}/apm-data-services/beacon',
    RT: {enabled: true},
    IframeMonitoring: {enabled: false, eventInit: "page_ready"},
    ClickMonitoring: {enabled: true, frameMonitoringEnabled: false, 
        fullMonitoringEnabled: true, 
        clickContainerLookup: GermainAPMSiebelOpenUIUtils.clickContainerLookup,
        clickLabelLookup: GermainAPMSiebelOpenUIUtils.fieldLabelLookup,
        /*additionalInfoLookup: GermainAPMSiebelOpenUIUtils.additionalInfoLookup,*/
        eventInit: "page_ready", eventClick: "mouseup", 
        hideFieldValueHelper: GermainAPMSiebelOpenUIUtils.hideFieldValueHelper},
    MouseMonitoring: {enabled: true, frameMonitoringEnabled: true, snapshotInterval: 100, 
        pushInterval: 15, eventInit: "page_ready" },
    ChangeMonitoring: {enabled : true, eventInit: "page_ready", 
        hideFieldValueHelper: GermainAPMSiebelOpenUIUtils.hideFieldValueHelper, 
        /*additionalInfoLookup: GermainAPMSiebelOpenUIUtils.additionalInfoLookup,*/
        changeLabelLookup: GermainAPMSiebelOpenUIUtils.fieldLabelLookup},
    KeyboardMonitoring: {enabled : true, eventInit: "page_ready"},
    AsyncMonitoring: {enabled : true},
    MemoryMonitoring: {enabled: true, repeatSeconds: 120, eventInit: "page_ready"},
    VisibilityMonitoring: {enabled: true, eventInit: "page_ready"},
    InactivityMonitoring: {enabled: true, eventInit: "page_ready", threshold: 30},
    StaticResourcesMonitoring: {enabled: true, eventInit: "page_ready", cssMonitoringEnabled: true, 
        cssParsingEnabled: true, imagesMonitoringEnabled: true, cacheEnabled: true},
    ScrollMonitoring: {enabled: true, snapshotInterval: 1000, pushInterval: 15, eventInit: "page_ready"},
    ResizeMonitoring: {enabled: true, eventInit: "dom_loaded"},
    DomMonitoring: {enabled: true, eventInit: "page_ready", pushInterval: 5, 
        pushFullInterval: 30, changesCountToSendFullBody: 500, dataTimeout: 30000 /*,excludeAttributes:[],excludeIds:[]*/}
}, {
    USE_AJAX: true, // if true then send all data using Ajax requests
    DATA_QUEUE: {
        enabled: true, // if true then send all data points to the data queue
        pushInterval: 5, // if USE_DATA_QUEUE=true then this value says how often should we send data from the queue back to apm (in seconds)
        queue: [] // storage placeholder
    },
    CONSOLE_MONITORING: true, // enable console warning and error monitoring
    CONSOLE_NAME_PARSER: GermainAPMSiebelOpenUIUtils.consoleNameParser, // console error message extractor
    ALERT_MONITORING: true, // enable window.alert warning and error messages
    ALERT_NAME_PARSER: GermainAPMSiebelOpenUIUtils.alertNameParser, // popup alert message extractor
    REQUEST_BODY_MONITORING: true, // catch POST request body
    REQUEST_BODY_MONITORING_SIZE_LIMIT: 7000, // limit body size (in chars length)
    URL_TITLE: GermainAPMSiebelOpenUIUtils.titleLookup, // extract request title
    DATA_TIMEOUT: 10000, // how long we can try to send collect data back (in ms)
    CUMULATIVE_TXN_MONITORING: {
        count: 1,
        refreshInterval: 15, // (in seconds) we check periodically if we can close current cumulative txn and send current cum. txn
        category: 'HTTP:Siebel Page View', // cumulative txn name
        hierarchyId: new Date().getTime() + Math.random().toString(36).substring(6),
        queryStringGenerator: GermainAPMSiebelOpenUIUtils.queryStringGenerator, // cumulative txn query string extractor
        excludeUrls: [ // exclude http request from cumulative txn
            /^(?!.*start\.swe.*|.*\/marker.*)/,
            /SWECmd=InvokeMethod&SWEService=Message\+Bar&SWEMethod=UpdatePrefMsg/,
            /SWECmd=InvokeMethod&SWEService=SWE\+Command\+Manager&SWEMethod=BatchCanInvoke/,
            /SWEService=Communications/,
            /SWECmd=Login/, 
            /channelservice/, 
            /ie-preamble/, 
            /Ping/,
            /SWECmd=InvokeMethod.*GetWebSessionInfo/,
            /SWECmd=InvokeMethod.*&SWEMethod=GetProfileAttr.*&SWEIPS=/
        ]
    },
    EXCLUDE_URLS: [ // exclude data points from monitoring by full URL (including query string)
        /SWEService=Communications/,
        /SWECmd=InvokeMethod&SWEService=Message\+Bar&SWEMethod=UpdatePrefMsg/,
        /SWECmd=InvokeMethod&SWEService=SWE\+Command\+Manager&SWEMethod=BatchCanInvoke/,
        /SWECmd=InvokeMethod.*&SWEMethod=GetProfileAttr.*&SWEIPS=/
    ],
    SESSION_MARKER_END: ["Logout", "Log Out", "Utloggning"]
}, {
    appName: 'Siebel',
    // serverHost: null, // provide if you want to hardcode serverHost value
    username: GermainAPMSiebelOpenUIUtils.usernameLookup,
    session: GermainAPMSiebelOpenUIUtils.sessionLookup
});
