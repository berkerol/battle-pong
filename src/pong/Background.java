package pong;

import acm.graphics.GLabel;
import acm.graphics.GRect;
import java.awt.Color;
import java.awt.Font;

public class Background {

    private final GRect background;
    private final GRect[] fragmentedLanes;
    private final GLabel[] labels;

    Background(int boardHeight, int boardWidth, int labelSize, int[] rgb, int scoreLeft, int scoreRight) {
        background = new GRect(0, 0, boardWidth, boardHeight);
        background.setColor(new Color(rgb[0], rgb[1], rgb[2]));
        background.setFillColor(new Color(rgb[0], rgb[1], rgb[2]));
        background.setFilled(true);
        int width = labelSize / 10, height = labelSize / 5;
        fragmentedLanes = new GRect[boardHeight / height];
        for (int i = 0; i < fragmentedLanes.length; i++) {
            if (i % 2 == 0) {
                fragmentedLanes[i] = new GRect(boardWidth / 2 - width / 2, i * height, width, height);
                fragmentedLanes[i].setColor(new Color(255 - rgb[0], 255 - rgb[1], 255 - rgb[2]));
                fragmentedLanes[i].setFillColor(new Color(255 - rgb[0], 255 - rgb[1], 255 - rgb[2]));
                fragmentedLanes[i].setFilled(true);
                fragmentedLanes[i].sendToFront();
            }
        }
        labels = new GLabel[2];
        labels[0] = new GLabel(scoreLeft + " " + scoreRight);
        labels[1] = new GLabel("PAUSED");
        for (GLabel label : labels) {
            label.setColor(new Color(255 - rgb[0], 255 - rgb[1], 255 - rgb[2]));
            label.setFont(new Font(Font.MONOSPACED, Font.BOLD, labelSize));
            label.sendToFront();
        }
        labels[0].setLocation(boardWidth / 2.0 - labels[0].getWidth() / 2, labels[0].getHeight());
        labels[1].setLocation(boardWidth / 2.0 - labels[1].getWidth() / 2, boardHeight);
        labels[1].setVisible(false);
    }

    GRect getBackground() {
        return background;
    }

    GRect[] getFragmentedLanes() {
        return fragmentedLanes;
    }

    GLabel[] getLabels() {
        return labels;
    }

    void refreshValues(int boardWidth, int scoreLeft, int scoreRight) {
        labels[0].setLabel(scoreLeft + " " + scoreRight);
        labels[0].setLocation(boardWidth / 2.0 - labels[0].getWidth() / 2, labels[0].getHeight());
    }
}
