package com.intellectx.app;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

import android.content.Context;
import android.content.pm.ActivityInfo;

import androidx.test.core.app.ActivityScenario;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;

import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(AndroidJUnit4.class)
public class MainActivityInstrumentedTest {

    @Test
    public void appContextUsesIntellectXPackage() {
        Context appContext = InstrumentationRegistry.getInstrumentation().getTargetContext();
        assertEquals("com.intellectx.app", appContext.getPackageName());
    }

    @Test
    public void mainActivityLaunchesAndRecreates() {
        try (ActivityScenario<MainActivity> scenario = ActivityScenario.launch(MainActivity.class)) {
            scenario.onActivity(activity -> {
                assertEquals("com.intellectx.app", activity.getPackageName());
                assertFalse(activity.isFinishing());
            });

            scenario.recreate();

            scenario.onActivity(activity -> assertFalse(activity.isFinishing()));
        }
    }

    @Test
    public void mainActivityAcceptsOrientationConfigurationChanges() {
        try (ActivityScenario<MainActivity> scenario = ActivityScenario.launch(MainActivity.class)) {
            scenario.onActivity(activity ->
                activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE)
            );
            scenario.onActivity(activity -> {
                assertEquals(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE, activity.getRequestedOrientation());
                assertFalse(activity.isFinishing());
            });

            scenario.onActivity(activity ->
                activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT)
            );
            scenario.onActivity(activity -> {
                assertEquals(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT, activity.getRequestedOrientation());
                assertFalse(activity.isFinishing());
            });
        }
    }
}
