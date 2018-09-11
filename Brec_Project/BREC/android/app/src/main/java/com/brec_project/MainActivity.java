package com.brec_project;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.util.Log;
import android.view.WindowManager;

import com.brec_project.components.emitter.AppNativeEventEmitter;
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    //Returns the name of the main component registered from JavaScript.
    //This is used to schedule rendering of the component.
    @Override
    protected String getMainComponentName() {
        return "BREC";
    }

    // Overriding onCreate to add KEEP_SCREEN_ON flag so that phone doesn't turn off screen
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        isStoragePermissionGranted();
    }

    public  boolean isStoragePermissionGranted() {
        if (Build.VERSION.SDK_INT >= 23) {
            if (checkSelfPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE)
                    == PackageManager.PERMISSION_GRANTED) {
                Log.v("Permissions","Permission is granted");
                return true;
            } else {

                Log.v("Permissions","Permission is revoked");
                ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 1);
                return false;
            }
        }
        else { //permission is automatically granted on sdk<23 upon installation
            Log.v("Permissions","Permission is granted");
            return true;
        }

    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if(grantResults[0]== PackageManager.PERMISSION_GRANTED){
            Log.v("Permissions","Permission: "+permissions[0]+ "was "+grantResults[0]);
            //resume tasks needing this permission
        }
    }
}
