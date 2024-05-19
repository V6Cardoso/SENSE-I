import requests
import matplotlib
matplotlib.use('agg')
import matplotlib.pyplot as plt
from matplotlib.dates import DateFormatter, AutoDateLocator, date2num
import matplotlib.ticker as ticker
import pandas as pd
from flask import Blueprint, request, send_file
from io import BytesIO
from fpdf import FPDF
import json
from datetime import datetime, timezone, timedelta
import pytz

from dmie.db import get_db

from .board import getSthCometData

bp = Blueprint('downloadGraphHandler', __name__)

@bp.route('/downloadGraph', methods=['POST'])
def download_graph():
    experiment_id = request.form.get('experiment_id')
    print('experiment_id:', experiment_id)

    db = get_db()
    experiment = db.execute("SELECT id, name, incubator, temperature, temperatureLowThreshold, temperatureHighThreshold, humidity, humidityLowThreshold, humidityHighThreshold, startTimestamp, endTimestamp, createdTimestamp, observation FROM experiments WHERE id = ?", (experiment_id,)).fetchone()
    if experiment is None:
        return "Experiment not found", 404
    
    startTimestamp = datetime.fromtimestamp(experiment['startTimestamp'], tz=pytz.utc).astimezone(pytz.timezone('America/Sao_Paulo')).isoformat()
    endTimestamp = datetime.fromtimestamp(experiment['endTimestamp'], tz=pytz.utc).astimezone(pytz.timezone('America/Sao_Paulo')).isoformat()

    temperatureData = getSthCometData(startTimestamp, endTimestamp, experiment['incubator'], 'temperature', '')
    humidityData = getSthCometData(startTimestamp, endTimestamp, experiment['incubator'], 'humidity', '')

    output_format = request.form.get('format', 'pdf')

    
    


    # Save the graph to the desired format
    if output_format == 'pdf':
        thresholds = {
            'temperature': (experiment['temperatureLowThreshold'], experiment['temperatureHighThreshold'], 'r'),
            'humidity': (experiment['humidityLowThreshold'], experiment['humidityHighThreshold'], 'b')
        }
        plt = generate_multiple_graphs(temperatureData, humidityData, thresholds)
        pdf_file = save_as_pdf(plt)
        return send_file(pdf_file, as_attachment=True, download_name='graph.pdf', mimetype='application/pdf')
    elif output_format == 'csv':
        csv_file = save_as_csv(temperatureData, humidityData)
        return send_file(BytesIO(csv_file.encode()), as_attachment=True, download_name='data.csv', mimetype='text/csv')
    else:
        return "Unsupported format", 400

def generate_multiple_graphs(temperature_data, humidity_data, thresholds=None):
    temperature_timestamps, temperatures = extract_data(temperature_data)
    humidity_timestamps, humidities = extract_data(humidity_data)

    n = 2
    fig, axs = plt.subplots(n, figsize=(10, 5 * n))

    if n == 1:
        axs = [axs]

    temp_thresholds = thresholds.get('temperature') if thresholds else (None, None, 'r')
    hum_thresholds = thresholds.get('humidity') if thresholds else (None, None, 'b')

    generate_graph(axs[0], temperature_timestamps, temperatures, 'Temperatura (°C)', 'Temperatura (°C)', *temp_thresholds)
    generate_graph(axs[1], humidity_timestamps, humidities, 'Umidade (%)', 'Umidade (%)', *hum_thresholds)

    plt.tight_layout()
    return plt

def generate_graph(ax, timestamps, data, label, y_label, low_threshold=None, high_threshold=None, threshold_color='r'):
    ax.plot(timestamps, data, label=label)
    if low_threshold is not None:
        ax.axhline(y=low_threshold, color=threshold_color, linestyle='--', label=f'Limite Inferior de {label}')
    if high_threshold is not None:
        ax.axhline(y=high_threshold, color=threshold_color, linestyle='--', label=f'Limite Superior de {label}')
    ax.set_xlabel('Tempo')
    ax.set_ylabel(y_label)
    ax.legend()
    ax.set_title(f'Gráfico de {label}')
    ax.xaxis.set_tick_params(rotation=45)
    
    date_formatter = DateFormatter('%d/%m/%y %H:%M', tz=pytz.timezone('America/Sao_Paulo'))
    ax.xaxis.set_major_formatter(date_formatter)

    locator = ticker.MaxNLocator(nbins='auto', prune=None)
    ax.xaxis.set_major_locator(locator)


def extract_data(data_objects):
    timestamps = [datetime.fromisoformat(obj['date'].replace('Z', '')) for obj in data_objects]
    values = [obj['value'] for obj in data_objects]
    return timestamps, values


def save_as_pdf(plt):
    pdf_file = BytesIO()
    plt.savefig(pdf_file, format='pdf')
    pdf_file.seek(0)
    plt.close()
    return pdf_file

def save_as_csv(temerature_data, humidity_data):
    temperature_date, temperature_value = extract_data(temerature_data)
    humidity_date, humidity_value = extract_data(humidity_data)

    df = pd.DataFrame({
        'Data': [DateFormatter('%d/%m/%y %H:%M', tz=pytz.timezone('America/Sao_Paulo')).format_data(date2num(date)) for date in temperature_date],
        'Temperatura': temperature_value,
        'Umidade': humidity_value
    })
    return df.to_csv()
