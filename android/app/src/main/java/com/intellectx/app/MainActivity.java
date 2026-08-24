package com.intellectx.app;

import android.os.Bundle;
import android.webkit.WebView;

import androidx.activity.OnBackPressedCallback;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                WebView webView = bridge != null ? bridge.getWebView() : null;
                if (webView == null) {
                    fallBackToSystemBack();
                    return;
                }

                // Next.js uses the browser History API for in-app navigation. Ask
                // the page first so Android Back follows SPA history instead of
                // closing the Activity when WebView.canGoBack() has not caught up.
                webView.evaluateJavascript(
                    "(function(){return window.history.length > 1 ? 'back' : 'root';})()",
                    value -> {
                        if ("\"back\"".equals(value)) {
                            webView.evaluateJavascript("window.history.back();", null);
                            return;
                        }

                        if (webView.canGoBack()) {
                            webView.goBack();
                            return;
                        }

                        fallBackToSystemBack();
                    }
                );
            }

            private void fallBackToSystemBack() {
                setEnabled(false);
                getOnBackPressedDispatcher().onBackPressed();
            }
        });
    }
}
