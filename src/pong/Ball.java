package pong;

import acm.graphics.GOval;
import java.awt.Color;

public class Ball {

    private final GOval image;
    private final int sizeX;
    private final int sizeY;
    private double speedX;
    private double speedY;

    Ball(double positionX, double positionY, int[] rgb, int sizeX, int sizeY, double speedX, double speedY) {
        image = new GOval(positionX, positionY, sizeX, sizeY);
        image.setColor(new Color(255 - rgb[0], 255 - rgb[1], 255 - rgb[2]));
        image.setFillColor(new Color(255 - rgb[0], 255 - rgb[1], 255 - rgb[2]));
        image.setFilled(true);
        image.sendToFront();
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    GOval getImage() {
        return image;
    }

    int getSizeX() {
        return sizeX;
    }

    int getSizeY() {
        return sizeY;
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
}
