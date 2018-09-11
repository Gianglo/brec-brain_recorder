package com.brec_project.components.database;

import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.List;



public class DatabaseModule extends ReactContextBaseJavaModule {

    private static AppDatabase appDatabase;
    private RecordingDao recordingDao;
    private SubjectDao subjectDao;

    private static Recording recording;

    private static String title;
    private static String header;


    public DatabaseModule(ReactApplicationContext reactContext) {
        super(reactContext);
        appDatabase = AppDatabase.getDatabase(reactContext.getApplicationContext());
        recordingDao = appDatabase.recordingDao();
        subjectDao = appDatabase.subjectDao();
    }


    @Override
    public String getName() {

        return "Database";
    }


    @ReactMethod
    public void setSubject(String name, String surname, String bornDate) {

        Subject new_subject = new Subject(name, surname, bornDate);

        long subjectId;

        // Save subject in db
        subjectId = subjectDao.insert(new_subject);


        if(subjectId != -1) {
            // If subject ins't already in db

            this.recording = new Recording(subjectId);

            Toast.makeText(getReactApplicationContext(), "Salvato!", Toast.LENGTH_SHORT).show();

        }else{
            // If subject is already in db

            // Find the subject and get his ID
            subjectId = subjectDao.getBySubject(name, surname, bornDate).getId();

            this.recording = new Recording(subjectId);


            // Get all recs of the subject
            List<Recording> recs = recordingDao.getAllBySubject(subjectId);

            // Get the last rec of the subject and increment it
            this.recording.setSession(recs.get(0).getSession());
            this.recording.incSession();

            Toast.makeText(getReactApplicationContext(), "Già inserito, caricato!", Toast.LENGTH_SHORT).show();

        }
    }


    @ReactMethod
    public void saveRecording(String graphType) {

        this.recording.setType(graphType);
        this.recording.setDateTime();

        // Save recording in db
        recordingDao.insert(this.recording);

        // Increase the recNumber for the next acquisition
        this.recording.incRecNumber();

        // Get the saved recording with the generated ID
        Recording lastRec = recordingDao.getAll().get(0);

        setTitle(lastRec);
        setHeader(lastRec);
    }



    private void setHeader(Recording rec){

        Subject subj = recordingDao.getSubject(rec.getId());

        header = "Recording_ID," + rec.getId() + ",\n"
                +"Type," + rec.getType() + ",\n"
                +"Subject_ID," + subj.getId() + ",\n"
                +"Name," + subj.getName() + ",\n"
                +"Surname," + subj.getSurname() + ",\n"
                +"Born_Date," + subj.getBornDate() + ",\n"
                +"Session," + rec.getSession() + ",\n"
                +"Number," + rec.getRecNumber() + ",\n"
                +"Date-Time," + rec.getDateTime() + ",\n";
    }


    public static String getHeader(){
        return header;
    }


    private void setTitle(Recording rec){
        title = rec.getId()+"_"+rec.getSubject()+"_"+rec.getSession()+"_"+rec.getRecNumber();
    }


    public static String getTitle(){
        return title;
    }
}