(() => {

    const script = document.currentScript;

    const loadWidget = () => {

        const widget = document.createElement("div");

        const widgetStyle = widget.style;
        widgetStyle.display = "none";
        widgetStyle.boxSizing = "border-box";
        widgetStyle.width = "500px";
        widgetStyle.height = "647px";
        widgetStyle.position = "absolute";
        widgetStyle.top = "40px";
        widgetStyle.right = "40px";
        widget.animate(
            [
                // { width: "0px", height: "0px" },
                // { width: "500px", height: "647px" },
                {display: "none", opacity: 0, transform: "scale(0)"},
                {display: "block", opacity: 1, transform: "scale(1)"},
            ],
            {
                duration: 500,
            },
        );
        widgetStyle.overflow = "hidden";
        widgetStyle.borderRadius = "10px";
        widgetStyle.scrollbarWidth = "none";

        const iframe = document.createElement("iframe");

        const iframeStyle = iframe.style;
        iframeStyle.boxSizing = "borderBox";
        iframeStyle.position = "absolute";
        iframeStyle.right = 0;
        iframeStyle.top = 0;
        iframeStyle.width = "100%";
        iframeStyle.height = "100%";
        iframeStyle.border = 0;
        iframeStyle.margin = 0;
        iframeStyle.padding = 0;
        iframeStyle.width = "500px";
        iframeStyle.borderRadius = "10px";
        iframeStyle.overflow = "hidden";
        iframeStyle.scrollbarWidth = "none";

        widget.appendChild(iframe);

        const greeting = script.getAttribute("data-greeting");

        const api = {

            sendMessage: (message) => {
                iframe.contentWindow.postMessage({
                    sendMessage: message
                }, "http://localhost:3000");
            },

            show: () => {
                widget.style.display = "block";
            },

            hide: () => {
                widget.style.display = "none";
            },

            toggle: () => {
                const display = window.getComputedStyle(widget, null).display;
                widget.style.display = display === "none" ? "block" : "none";
                if(display === "block") {
                    widget.animate(
                        [
                            // { width: "0px", height: "0px" },
                            // { width: "500px", height: "647px" },
                            {display: "none", opacity: 0, transform: "scale(0)"},
                            {display: "block", opacity: 1, transform: "scale(1)"},
                        ],
                        {
                            duration: 800,
                        },
                    );
                }
            },

            onHide: () => { }

        }

        iframe.addEventListener("load", () => {

            window.addEventListener("getWidgetApi", () => {

                const event = new CustomEvent('widgetApi', { detail: api });
                window.dispatchEvent(event);

            });

            window.addEventListener("message", evt => {

                if (evt.origin !== "http://localhost:3000") {
                    return;
                }

                if (evt.data === "hide") {
                    api.hide();
                    api.onHide();
                }

            });

            iframe.contentWindow.postMessage({ greeting: greeting }, "http://localhost:3000");
            widgetStyle.display = "block";
        });

        const license = script.getAttribute("data-license");
        const widgetUrl = `http://localhost:3000?license=${license}`;

        iframe.src = widgetUrl;

        document.body.appendChild(widget);

    }

    if (document.readyState === "complete") {
        loadWidget();
    } else {
        document.addEventListener("readystatechange", () => {
            if (document.readyState === "complete") {
                loadWidget();
            }
        });
    }

})();
