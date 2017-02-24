package pong;

import acm.graphics.GRoundRect;
import java.awt.Color;

public class Paddle {

    private final int height;
    private final GRoundRect image;
    private double speedX;
    private double speedY;
    private int variance;
    private final int width;

    Paddle(int height, double positionX, double positionY, int[] rgb, int width) {
        this.height = height;
        image = new GRoundRect(positionX, positionY, width, height, width);
        image.setColor(new Color(255 - rgb[0], 255 - rgb[1], 255 - rgb[2]));
        image.setFillColor(new Color(255 - rgb[0], 255 - rgb[1], 255 - rgb[2]));
        image.setFilled(true);
        image.sendToFront();
        this.width = width;
    }

    GRoundRect getImage() {
        return image;
    }

    int getSizeX() {
        return width;
    }

    int getSizeY() {
        return height;
    }

    double getSpeedX() {
        return speedX;
    }

    void setSpeedX(double speedX) {
        this.speedX = speedX;
    }

    double getSpeedY() {
        return speedY;
    }

    void setSpeedY(double speedY) {
        this.speedY = speedY;
    }

    int getVariance() {
        return variance;
    }

    void setVariance(int variance) {
        this.variance = variance;
    }
}