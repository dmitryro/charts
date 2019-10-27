from datetime import datetime as dt
from datetime import timedelta
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS, cross_origin
import logging
import os
import pytz

from bandwidths import BANDWIDTHS

app = Flask(__name__)
CORS(app)

logger = logging.getLogger("gunicorn.error")
logger.setLevel(logging.DEBUG)
app.logger.handlers = logger.handlers
app.logger.setLevel(logger.level)


def before(start, end, window_time):
    """ Helper function to calculate times in window """
    dt_start = dt.fromtimestamp(int(start))   
    dt_end = dt.fromtimestamp(int(end))
    return dt_start <= dt_end and dt_start >= dt_end - timedelta(seconds=int(window_time))


def read_time(ts):
    """ Helper function to convert timestamps to strings """
    tz = pytz.timezone('America/New_York')
    dt_obj = dt.fromtimestamp(int(ts), tz)
    return dt_obj.strftime("%Y-%m-%d, %H:%M:%S")


@cross_origin()
@app.route('/deviceuuids/', methods=['GET'])
def read_deviceuuids():
    result = [b['device_id'] for b in BANDWIDTHS]
    return jsonify(result), 200        


@cross_origin()
@app.route('/timestamps/<device_uuid>', methods=['GET'])
def read_timestamps(device_uuid):
    try:
        result = [read_time(b['timestamp']) for b in BANDWIDTHS if b['device_id'] == device_uuid]
        status = 200
    except Exception as e:
        status = 400
    return jsonify(result), status 


@cross_origin()
@app.route('/bandwidths/', methods=['GET'])
@app.route('/bandwidths/<device_uuid>/', methods=['GET'])
@app.route('/bandwidths/<device_uuid>/<end_time>/', methods=['GET'])
@app.route('/bandwidths/<device_uuid>/<end_time>/<window_time>/', methods=['GET'])
@app.route('/bandwidths/<device_uuid>/<end_time>/<window_time>/<num_wundows>', methods=['GET'])
def read_bandwidths(device_uuid, end_time=dt.timestamp(dt.now()), window_time=60, num_wundows=10):
    if request.method == 'GET':
        result = []
        try:
            tz = pytz.timezone('America/New_York')
            dt_object = dt.fromtimestamp(int(end_time), tz)
            logger.debug(f"Parsed datetime {dt_object.year} {dt_object.month} {dt_object.day} {dt_object.hour}:{dt_object.minute}:{dt_object.second}")
        except Exception as e:
            logger.error(f"Failed parsing datetime {e}")

        if not device_uuid:
            return jsonify(result), 400

        result = [b for b in BANDWIDTHS if b['device_id'] == device_uuid]
        result = [b for b in result if before(b['timestamp'], end_time, window_time)]

        try:
            result = result[:int(num_wundows)]
        except Exception as e:
            pass

        return jsonify(result), 200



if __name__ == '__main__':
    app.run(host=os.environ.get("API_HOST", "0.0.0.0"), 
            debug=os.environ.get("DEBUG", True))
