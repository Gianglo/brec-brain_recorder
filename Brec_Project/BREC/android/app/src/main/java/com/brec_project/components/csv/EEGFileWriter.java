package com.brec_project.components.csv;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Environment;
import android.os.SystemClock;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v4.content.FileProvider;
import android.util.Log;
import android.widget.Toast;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Arrays;

/**
 * Writes EEG data (either raw/filtered EEG or computed FFT) into a csv. Presents a toast when
 * recording is started and starts sharing intent for sending data to email when recording is
 * completed
 */

public class EEGFileWriter {

    // ---------------------------------------------------------------------------
    // Variables

    private Context context;
    StringBuilder builder;
    public FileWriter fileWriter;
    private static boolean isRecording;

    // ---------------------------------------------------------------------------
    // Constructor

    public EEGFileWriter(Context context, String title) {
        this.context = context;
        isRecording = false;
    }

    // ---------------------------------------------------------------------------
    // Internal methods

    public void initFile(String title, String header) {
        builder = new StringBuilder();

        //Header whit addition info of the session
        if(header != ""){
          builder.append(header);
            builder.append("\n");
        }

        builder.append("Timestamp (ms),");
        Toast.makeText(context, "Recording data in " + title + ".csv", Toast.LENGTH_SHORT).show();
        isRecording = true;
        if(header.contains("WAVES")) {
            for(int i=1; i<129; i++) {
                builder.append(i + " hz,");
            }
            builder.append("\n");
        } else if(title.contains("Classifier")) {
            builder.append("Label,");
            for(int i=1; i<=16; i++) {
                builder.append(" Feature " + i + ",");
            }
            builder.append("\n");
        }
        else {
            for(int i=1; i<5; i++) {
                builder.append("Electrode " + i + ",");
            }
            builder.append("\n");
        }
    }

    //No header
    public void initFile(String title) {
      initFile(title, "");
    }



    public void addDataToFile(double[] data) {
        // Append timestamp
        Long tsLong = System.currentTimeMillis();
        builder.append(tsLong.toString() +",");
        for (int j = 0; j < data.length; j++) {
            builder.append(Double.toString(data[j]));
            if (j < data.length - 1) {
                builder.append(",");
            }
        }
        builder.append("\n");
    }

    public void addLineToFile(String line){
        builder.append(line);
        builder.append("\n");
    }


    /* Checks if external storage is available for read and write */
    private boolean isExternalStorageWritable() {

        if (Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState())) {
            Log.i("State","Yes, is writable");
            return true;
        }
        return false;
    }


    public void writeFile(String title) {

        if(isExternalStorageWritable() && checkPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)) {

            File dir = new File(Environment.getExternalStorageDirectory(), "/Brec_recs");

            File file = new File(dir, title + ".csv");


            if (!dir.exists()) {
                dir.mkdirs();
            }

            try {
                fileWriter = new java.io.FileWriter(file);
                BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);
                bufferedWriter.write(builder.toString());
                bufferedWriter.close();
                Toast.makeText(context, "Salvato in " + file.getPath(), Toast.LENGTH_LONG).show();
                isRecording = false;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }else {
            Toast.makeText(context, "Cannot Write to External Storage", Toast.LENGTH_LONG).show();
        }
    }

    public boolean checkPermission(String permission){
        return (ContextCompat.checkSelfPermission(context.getApplicationContext(), permission) == PackageManager.PERMISSION_GRANTED);
    }


    public boolean isRecording() {
        return isRecording;
    }
}
