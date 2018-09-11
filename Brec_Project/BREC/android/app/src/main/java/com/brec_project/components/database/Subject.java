package com.brec_project.components.database;

import android.arch.persistence.room.*;
import android.support.annotation.NonNull;


@Entity(indices = {@Index(value = {"name", "surname", "born_date"},
        unique = true)})

public class Subject {

    public Subject(String name, String surname, String bornDate){
        this.name=name;
        this.surname=surname;
        this.bornDate=bornDate;
    }

    @PrimaryKey(autoGenerate = true)
    private long id;

    @NonNull
    @ColumnInfo(name = "name")
    private String name;

    @NonNull
    @ColumnInfo(name = "surname")
    private String surname;

    @NonNull
    @ColumnInfo(name = "born_date")
    private String bornDate;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @NonNull
    public String getName() {
        return name;
    }

    public void setName(@NonNull String name) {
        this.name = name;
    }

    @NonNull
    public String getSurname() {
        return surname;
    }

    public void setSurname(@NonNull String surname) {
        this.surname = surname;
    }

    @NonNull
    public String getBornDate() {
        return bornDate;
    }

    public void setBornDate(@NonNull String bornDate) {
        this.bornDate = bornDate;
    }

    @Override
    public String toString() {
        return    "ID: " + id + "\n"
                + "NAME: " + name + "\n"
                + "SURNAME: " + surname + "\n"
                + "BORN DATE: " + bornDate + "\n\n";
    }
}
