# -*- coding: utf-8 -*-
"""
Created on Sun Apr 28 23:47:04 2024

@author: asa
"""
import numpy as np
import streamlit as st
import pickle
import pandas as pd
import folium
from streamlit_folium import folium_static
import branca.colormap as cm

# Load the model
model_try = pickle.load(open('C:/Users/eng_b/OneDrive/Desktop/soil_claymodel_lr.pkl', 'rb'))

def predict_soil_Silt(uploaded_file):
    # Read the uploaded XLSX file
    data = pd.read_excel(uploaded_file)
    data = data.dropna()
    x_data = data[['savi', 'ndvi', 'msavi2', 'ci', 'bi', 'bi2', 'tvi', 'msi', 'grvi', 'evi', 'ri', 'satvi', 'v']]  # features

    predictions = model_try.predict(x_data)
    predictions = np.exp(predictions)

    return predictions

def main():
    # Title and description for your app
    st.title("Soil Silt Content Prediction App")
    st.write("Predict Silt content for multiple soil samples in an XLSX file.")

    # File uploader for XLSX input
    uploaded_file = st.file_uploader("Upload an XLSX file:", type='xlsx')

    if uploaded_file is not None:
        # Call predict_soil_Silt function with the uploaded file
        predictions = predict_soil_Silt(uploaded_file)

        # Display the prediction results (consider showing predictions for each sample)
        st.success("Predicted Silt Content:")
        for i in range(len(predictions)):
            st.write(f"Sample {i+1}: {predictions[i]}")

        # Create a DataFrame for the predictions
        predictions_df = pd.DataFrame(predictions, columns=['predictions_clay'])

        # Save the predictions to a new Excel file
        output_file = 'predictions.xlsx'
        predictions_df.to_excel(output_file, index=False)
        st.info(f"Predictions saved to {output_file}")

        # Reload the data to include predictions
        mapdata = pd.read_excel(output_file)
        
        # Example: Replace with actual latitude and longitude columns
        mapdata['POINT_Y'] = mapdata.index  
        mapdata['POINT_X'] = mapdata.index  

        # Create a folium map centered around the average latitude and longitude
        map_center = [mapdata['POINT_Y'].mean(), mapdata['POINT_X'].mean()]
        soil_map_c = folium.Map(location=map_center, zoom_start=5)

        # Create a colormap
        min_clay = mapdata['predictions_clay'].min()
        max_clay = mapdata['predictions_clay'].max()
        colormap = cm.linear.YlOrRd_09.scale(min_clay, max_clay)

        # Add data points to the map with color-coded markers
        for index, row in mapdata.iterrows():
            folium.CircleMarker(
                location=(row['POINT_Y'], row['POINT_X']),
                radius=10,  # Adjust radius as needed
                popup=f"Clay Content: {row['predictions_clay']}%",
                color=colormap(row['predictions_clay']),
                fill=True,
                fill_color=colormap(row['predictions_clay'])
            ).add_to(soil_map_c)

        # Add colormap to the map
        colormap.add_to(soil_map_c)

        # Display the map
        folium_static(soil_map_c)
    else:
        st.info("Please upload an XLSX file for prediction.")

if __name__ == "__main__":
    main()
