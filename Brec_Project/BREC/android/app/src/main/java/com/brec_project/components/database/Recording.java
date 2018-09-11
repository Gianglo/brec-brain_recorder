package com.brec_project.components.database;

import android.arch.persistence.room.*;
import android.support.annotation.NonNull;
import java.util.Calendar;

import static android.arch.persistence.room.ForeignKey.CASCADE;


@Entity(foreignKeys = @ForeignKey(entity = Subject.class,
        parentColumns = "id",
        childColumns = "subject",
        onDelete = CASCADE))
public class Recording {

    public Recording(long subject){
        this.subject=subject;
        this.session=1;
        this.recNumber=1;
    }


    @PrimaryKey(autoGenerate = true)
    private long id;

    @NonNull
    @ColumnInfo(name = "type")
    private String type;

    @NonNull
    @ColumnInfo(name = "subject")
    private long subject;

    @NonNull
    @ColumnInfo(name = "session")
    private int session;

    @NonNull
    @ColumnInfo(name = "rec_number")
    private int recNumber;

    @NonNull
    @ColumnInfo(name = "date_time")
    private String dateTime;


    public void setId(long id) {

        this.id = id;
    }


    public long getId() {

        return id;
    }


    public void setType(@NonNull String type) {

        this.type = type;
    }


    public String getType() {

        return type;
    }


    public long getSubject(){

        return subject;
    }


    public void setSession(int session) {

        this.session = session;
    }

    public int getSession() {

        return session;
    }

    public void setRecNumber(@NonNull int recNumber) {
        this.recNumber = recNumber;
    }

    public int getRecNumber() {

        return recNumber;
    }

    public void setDateTime(@NonNull String dateTime) {
        this.dateTime = dateTime;
    }

    public void setDateTime() {

        this.dateTime = Calendar.getInstance().getTime().toString();
    }


    public String getDateTime() {

        return dateTime; }

    public void incSession(){

        session++;
    }


    public void incRecNumber(){

        recNumber++;
    }


    @Override
    public String toString() {
        return    "ID: " + id + "\n"
                + "TYPE: " + type + "\n"
                + "SUBJECT ID: " + subject + "\n"
                + "SESSION: " + session + "\n"
                + "NUMBER: " + recNumber + "\n"
                + "DATE TIME: " + dateTime + "\n\n";
    }
}
