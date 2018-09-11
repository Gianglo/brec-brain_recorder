package com.brec_project.components.database;

import android.arch.persistence.room.*;
import android.content.Context;


@Database(entities = {Recording.class, Subject.class}, version = 1)
public abstract class AppDatabase extends RoomDatabase {

    public abstract RecordingDao recordingDao();
    public abstract SubjectDao subjectDao();

    private static AppDatabase INSTANCE;


    public static AppDatabase getDatabase(final Context context) {
        if (INSTANCE == null) {
            synchronized (AppDatabase.class) {
                if (INSTANCE == null) {
                    INSTANCE = Room.databaseBuilder(context.getApplicationContext(),
                            AppDatabase.class, "app_database")
                            .build();

                }
            }
        }
        return INSTANCE;
    }

}