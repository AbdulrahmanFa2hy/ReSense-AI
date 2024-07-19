# -*- coding: utf-8 -*-
"""
Created on Sat Jun 29 18:17:56 2024

@author: asa
"""

import numpy as np
import streamlit as st
import pickle
import pandas as pd
import folium
from streamlit_folium import folium_static
import branca.colormap as cm

# Load the models
model_clay = pickle.load(open('./pkls/soil_claymodel_lr.pkl', 'rb'))
model_sand = pickle.load(open('./pkls/soil_sandmodel_lr.pkl', 'rb'))
model_silt = pickle.load(open('./pkls/soil_siltmodel_lr.pkl', 'rb'))
def predict_soil_component(uploaded_file, component):
    # Read the uploaded XLSX file
    data = pd.read_excel(uploaded_file)
    data = data.dropna()
    x_data = data[['savi', 'ndvi', 'msavi2', 'ci', 'bi', 'bi2', 'tvi', 'msi', 'grvi', 'evi', 'ri', 'satvi', 'v']]  # features

    if component == 'Clay':
        predictions = model_clay.predict(x_data)
    elif component == 'Sand':
        predictions = model_sand.predict(x_data)
    elif component == 'Silt':
        predictions = model_silt.predict(x_data)

    predictions = np.exp(predictions)
    return predictions

def main():
    # Custom CSS
    st.markdown(
        """
        <style>
        .main {
            background-color: #2596be;
            padding: 2rem;
        }
        .title {
            font-size: 3rem;
            color: #e28743;
        }
        .description {
            font-size: 1.2rem;
            color: #555;
        }
        .component-select, .file-uploader {
            margin-bottom: 2rem;
        }
        .prediction-results {
            margin-top: 2rem;
        }
        </style>
        """,
        unsafe_allow_html=True
    )

    # Title and description for your app
    st.markdown("<div class='title'>Soil Texture Prediction App</div>", unsafe_allow_html=True)
    st.markdown("<div class='description'>Predict Clay, Sand, or Silt content for multiple soil samples in an XLSX file.</div>", unsafe_allow_html=True)

    # Selection box for choosing the component
    component = st.selectbox("Choose the soil component to predict:", ('Clay', 'Sand', 'Silt'), key='component-select')

    # File uploader for XLSX input
    uploaded_file = st.file_uploader("Upload an XLSX file:", type='xlsx', key='file-uploader')

    if uploaded_file is not None:
        # Call predict_soil_component function with the uploaded file and selected component
        predictions = predict_soil_component(uploaded_file, component)

        # Display the prediction results (consider showing predictions for each sample)
        st.success(f"Predicted {component} Content:")
        for i in range(len(predictions)):
            st.write(f"Sample {i+1}: {predictions[i]}")

        # Create a DataFrame for the predictions
        predictions_df = pd.DataFrame(predictions, columns=[f'predictions_{component.lower()}'])

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
        soil_map = folium.Map(location=map_center, zoom_start=5)

        # Create a colormap
        min_value = mapdata[f'predictions_{component.lower()}'].min()
        max_value = mapdata[f'predictions_{component.lower()}'].max()
        colormap = cm.linear.YlOrRd_09.scale(min_value, max_value)

        # Add data points to the map with color-coded markers
        for index, row in mapdata.iterrows():
            folium.CircleMarker(
                location=(row['POINT_Y'], row['POINT_X']),
                radius=10,  # Adjust radius as needed
                popup=f"{component} Content: {row[f'predictions_{component.lower()}']}%",
                color=colormap(row[f'predictions_{component.lower()}']),
                fill=True,
                fill_color=colormap(row[f'predictions_{component.lower()}'])
            ).add_to(soil_map)

        # Add colormap to the map
        colormap.add_to(soil_map)

        # Display the map
        folium_static(soil_map)
    else:
        st.info("Please upload an XLSX file for prediction.")

if __name__ == "__main__":
    main()
