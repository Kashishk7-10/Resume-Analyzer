# Resume Analyzer Using Random Forest Classification

## Overview
This project develops a Machine Learning model to classify resumes into "Good Fit," "Potential," or "Bad Fit" for job roles using a Random Forest algorithm. Built with Python, Pandas, and Scikit-learn, it leverages data preprocessing and feature engineering to enhance hiring decisions.

## Dataset
- **Source**: [Resume-Job Description Fit Dataset](https://huggingface.co/datasets/cnamuangtoun/resume-job-description-fit/viewer/default/train?p=2&views%5B%5D=train) from Hugging Face
- **Description**: Contains resume and job description pairs labeled as "Good Fit," "Potential," or "Bad Fit."
- **Features**: Resume text, job description text, and corresponding fit labels.
- **Usage**: Used for training and evaluating the Random Forest model after preprocessing.

## Project Details
- **Objective**: Automate resume screening by predicting the suitability of candidates for specific job roles.
- **Algorithm**: Random Forest Classifier implemented via Scikit-learn.
- **Preprocessing**:
  - Cleaned and tokenized resume and job description text using Pandas.
  - Extracted features like keyword matching and skill relevance.
  - Handled missing data and normalized text inputs.
- **Model Performance**:
  - Achieved 85% accuracy on test data.
  - Evaluated using precision, recall, and F1-score metrics.
- **Tools**:
  - Python, Pandas, NumPy, Scikit-learn
  - Jupyter Notebook for development and testing
- **Graphical User Interface**
  - Developed an interactive GUI using Gradio to enable user-friendly resume and job description input for real-time classification.
  - Allows users to upload resume and job description text files, view model predictions, and access confidence scores through a web-based interface.

## License
MIT License

## Contact
For questions, contact Ghulam Muttaqa Shah at ghulammuttaqashah@gmail.com.
