import joblib
import numpy as np
import pandas as pd

# Load the saved model and scaler
model = joblib.load('./SavedModels/RandomForest/model.pkl')
scaler = joblib.load('./SavedModels/RandomForest/scaler.pkl')

# Function to load data from CSV, scale it, make predictions, and save results to a CSV
def predict_and_save_to_csv(csv_file_path, output_csv_path):
    df = pd.read_csv(csv_file_path)
    df = df.dropna()

    df["Spectral_Data"] = df["Spectral_Data"].astype(str)
    X_spectral = np.array(df["Spectral_Data"].str.split(",").apply(lambda x: list(map(float, x))).tolist())

    # Combine Spectral_Data and Adulteration_Level as features
    X = np.hstack((X_spectral, df["Adulteration_Level"].values.reshape(-1, 1)))

    # Standardize the feature set
    X_scaled = scaler.transform(X)

    # Make predictions
    y_pred = model.predict(X_scaled)
    y_proba = model.predict_proba(X_scaled)[:, 1]  # Probability for the positive class

    # Add predictions and probabilities to the DataFrame
    df['Prediction'] = ['Adulterated' if pred == 1 else 'Not Adulterated' for pred in y_pred]
    df['Probability'] = y_proba

    # Save the DataFrame to a new CSV file
    df.to_csv(output_csv_path, index=False)
    print(f"Predictions saved to {output_csv_path}")
