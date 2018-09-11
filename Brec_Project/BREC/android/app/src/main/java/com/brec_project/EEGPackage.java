package com.brec_project;

import android.util.Log;

import com.brec_project.components.classifier.ClassifierModule;
import com.brec_project.components.database.DatabaseModule;
import com.brec_project.components.emitter.AppNativeEventEmitter;
import com.brec_project.components.managers.FilterGraphManager;
import com.brec_project.components.managers.EEGGraphManager;
import com.brec_project.components.managers.PSDGraphManager;
import com.brec_project.components.connector.ConnectorModule;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.List;

public class EEGPackage implements ReactPackage {

    public MainApplication appState;

    @Override
    // Register Native Modules to JS
    public List<NativeModule> createNativeModules(ReactApplicationContext reactApplicationContext) {
        appState.eventEmitter = new AppNativeEventEmitter(reactApplicationContext);
        Log.w("eventEmitter", " " + appState.eventEmitter);
        return Arrays.<NativeModule>asList(
                new ConnectorModule(reactApplicationContext),
                new ClassifierModule(reactApplicationContext),
                new DatabaseModule(reactApplicationContext),
                appState.eventEmitter);
    }

    @Override
    // Registers Java ViewManagers to JS
    public List<ViewManager> createViewManagers(ReactApplicationContext reactApplicationContext) {
        return Arrays.<ViewManager>asList(
                new EEGGraphManager(),
                new FilterGraphManager(),
                new PSDGraphManager()
        );
    }
}
