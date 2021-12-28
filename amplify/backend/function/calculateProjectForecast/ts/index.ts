import {
    AppSyncResolverEvent
} from 'aws-lambda';
import type {GetProjectForecastQueryVariables} from "../../../../../src/API"

const simulationRuns = 10000

export const handler = async (
    event: AppSyncResolverEvent<GetProjectForecastQueryVariables, number>
): Promise<number> => {
    let confidence = 0.5;
    const conf = event.arguments.confidence;

    if (conf == null || conf <= 0) {
    } else if (conf > 1) {
        confidence = 1;
    } else if (conf > 0) {
        confidence = conf;
    }

    return projectForecast(event.arguments.velocities, event.arguments.target, confidence);
};

async function projectForecast(velocities: number[], target: number, confidence: number, runs = simulationRuns): Promise<number> {
    const forecasts = await Promise.all([...Array(runs)].map(async (_, i) => singleForecast(velocities, target)));

    return forecasts.sort(function(a, b) {return a - b})[Math.floor((runs - 1) * confidence)];
}

function singleForecast(velocities: number[], target: number): number {
    let remain = target;
    let forecast = 0;

    while (remain > 0) {
        forecast += 1;
        remain -= iterationForecast(velocities);
    }

    return forecast;
}

function iterationForecast(velocities: number[]): number {
    return velocities[Math.floor(Math.random() * velocities.length)];
}