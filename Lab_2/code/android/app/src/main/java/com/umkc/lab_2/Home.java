package com.umkc.lab_2;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import com.ibm.watson.developer_cloud.service.security.IamOptions;
import com.ibm.watson.developer_cloud.visual_recognition.v3.VisualRecognition;
import com.ibm.watson.developer_cloud.visual_recognition.v3.model.ClassResult;
import com.ibm.watson.developer_cloud.visual_recognition.v3.model.ClassifiedImages;
import com.ibm.watson.developer_cloud.visual_recognition.v3.model.ClassifyOptions;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;

import io.reactivex.Single;
import io.reactivex.SingleObserver;
import io.reactivex.SingleOnSubscribe;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.Disposable;
import io.reactivex.schedulers.Schedulers;

public class Home extends AppCompatActivity {
    private static final String TAG = "LogActivity";
    private final String API_KEY = "IdIwD2cdaC4qmx9beDda4eVnfoH2rh7pM4TFvJRA9Yuu";
    Single<ClassifiedImages> observable;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        InputStream imageStream =null;
        try {
            imageStream = getAssets().open("fruitbowl.jpg");
        } catch (IOException e) {
            e.printStackTrace();
        }
        InputStream finalImageStream = imageStream;
        observable = Single.create((SingleOnSubscribe<ClassifiedImages>) emitter -> {
            IamOptions options = new IamOptions.Builder()
                    .apiKey(API_KEY)
                    .build();

            VisualRecognition visualRecognition = new VisualRecognition("2018-03-19", options);
            ClassifyOptions classifyOptions = new ClassifyOptions.Builder()
                    //.url("https://i5.walmartimages.ca/images/Enlarge/580/6_r/875806_R.jpg")
                    .imagesFile(finalImageStream)
                    .imagesFilename("fruitbowl.jpg")
                    .classifierIds(Collections.singletonList("food"))
                    .threshold((float) 0.6)
                    .owners(Collections.singletonList("me"))
                    .build();
            ClassifiedImages classifiedImages = visualRecognition.classify(classifyOptions).execute();
            emitter.onSuccess(classifiedImages);
        }).subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread());
    }

    public void getResult(View view)
    {
        observable.subscribe(new SingleObserver<ClassifiedImages>() {
            @Override
            public void onSubscribe(Disposable d) {

            }

            @Override
            public void onSuccess(ClassifiedImages classifiedImages) {
                System.out.println(classifiedImages.toString());
                List<ClassResult> resultList = classifiedImages.getImages().get(0).getClassifiers().get(0).getClasses();
                String url = classifiedImages.getImages().get(0).getSourceUrl();
                TextView result =findViewById(R.id.lblResult);
                result.setText(classifiedImages.toString());
            }

            @Override
            public void onError(Throwable e) {
                System.out.println(e.getMessage());
            }
        });
    }
}
