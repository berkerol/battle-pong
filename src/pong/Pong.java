package pong;

import acm.graphics.GCanvas;
import java.awt.Dimension;
import java.awt.Toolkit;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseMotionAdapter;
import java.awt.event.WindowEvent;
import java.awt.event.WindowFocusListener;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Random;
import java.util.Scanner;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.SwingUtilities;

public class Pong {

    private static boolean ballLeft = false;
    private static JFrame frame;
    private static boolean pause = false;
    private static int scoreLeft = 0;
    private static int scoreRight = 0;

    public static void main(String[] args) throws InterruptedException {
        String title = "Pong";
        Dimension dimension = Toolkit.getDefaultToolkit().getScreenSize();
        int[] dimensions = {(int) dimension.getWidth(), (int) dimension.getHeight()};
        Scanner input = null;
        try {
            input = new Scanner(new File("PongConfiguration.ini"));
        }
        catch (FileNotFoundException ex) {
            JOptionPane.showMessageDialog(null, ex, title, JOptionPane.ERROR_MESSAGE);
            return;
        }
        int framesPerSecond = input.nextInt();
        input.nextLine();
        int pixelsPerSecond = input.nextInt();
        input.nextLine();
        int[] backgroundColor = {input.nextInt(), input.nextInt(), input.nextInt()};
        input.nextLine();
        int ballSizeX = input.nextInt();
        input.nextLine();
        int ballSizeY = input.nextInt();
        input.nextLine();
        double ballSpeed = input.nextInt() * 1.0 * pixelsPerSecond / framesPerSecond;
        input.nextLine();
        String[] heightOptions = makeOptions(dimensions[1] - 40);
        int boardHeight = Integer.parseInt((String) JOptionPane.showInputDialog(null, "Choose the height of the board.", title,
                JOptionPane.QUESTION_MESSAGE, null, heightOptions, heightOptions[heightOptions.length - 1]));
        String[] widthOptions = makeOptions(dimensions[0] - 17);
        int boardWidth = Integer.parseInt((String) JOptionPane.showInputDialog(null, "Choose the width of the board.", title,
                JOptionPane.QUESTION_MESSAGE, null, widthOptions, widthOptions[widthOptions.length - 1]));
        int bounceAngle = input.nextInt();
        input.nextLine();
        int gameType = input.nextInt();
        input.nextLine();
        boolean keyboard = input.nextInt() != 0;
        input.nextLine();
        int labelSize = input.nextInt();
        input.nextLine();
        int paddleLeftHeight = input.nextInt();
        input.nextLine();
        double paddleLeftSpeed = input.nextInt() * 1.0 * pixelsPerSecond / framesPerSecond;
        input.nextLine();
        int paddleLeftWidth = input.nextInt();
        input.nextLine();
        int paddleRightHeight = input.nextInt();
        input.nextLine();
        double paddleRightSpeed = input.nextInt() * 1.0 * pixelsPerSecond / framesPerSecond;
        input.nextLine();
        int paddleRightWidth = input.nextInt();
        input.nextLine();
        boolean resetBehavior = input.nextInt() != 0;
        input.close();
        Random random = new Random();
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                frame = new JFrame(title);
                frame.setSize(boardWidth + 17, boardHeight + 40);
                frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
                frame.setLocationRelativeTo(null);
                frame.setVisible(true);
            }
        });
        GCanvas canvas = new GCanvas();
        frame.add(canvas);
        Background background = new Background(boardHeight, boardWidth, labelSize, backgroundColor, scoreLeft, scoreRight);
        canvas.add(background.getBackground());
        for (int i = 0; i < background.getFragmentedLanes().length; i++) {
            if (i % 2 == 0) {
                canvas.add(background.getFragmentedLanes()[i]);
            }
        }
        for (int i = 0; i < background.getLabels().length; i++) {
            canvas.add(background.getLabels()[i]);
        }
        Ball ball = new Ball(boardWidth / 2.0, random.nextInt(boardHeight / 2), backgroundColor, ballSizeX, ballSizeY, ballSpeed, ballSpeed);
        canvas.add(ball.getImage());
        Paddle paddleLeft = new Paddle(paddleLeftHeight, paddleLeftWidth, 0, backgroundColor, paddleLeftWidth);
        canvas.add(paddleLeft.getImage());
        Paddle paddleRight = new Paddle(paddleRightHeight, boardWidth - 2 * paddleRightWidth, 0, backgroundColor, paddleRightWidth);
        canvas.add(paddleRight.getImage());
        paddleRight.setVariance(random.nextInt(paddleRight.getSizeY()));
        frame.addWindowFocusListener(new WindowFocusListener() {
            @Override
            public void windowGainedFocus(WindowEvent e) {
                pause = false;
            }

            @Override
            public void windowLostFocus(WindowEvent e) {
                pause = true;
            }
        });
        canvas.addMouseMotionListener(new MouseMotionAdapter() {
            @Override
            public void mouseMoved(MouseEvent e) {
                if (!pause && !keyboard && ((gameType == 0 && e.getX() < boardWidth / 2) || gameType == 1)) {
                    paddleLeft.getImage().setLocation(paddleLeft.getImage().getX(), e.getY() - paddleLeft.getSizeY() / 2.0);
                }
                if (!pause && !keyboard && (gameType == 0 && e.getX() >= boardWidth / 2)) {
                    paddleRight.getImage().setLocation(paddleRight.getImage().getX(), e.getY() - paddleLeft.getSizeY() / 2.0);
                }
            }
        });
        KeyListener keyListener = new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {
                int keyCode = e.getKeyCode();
                if (keyCode == KeyEvent.VK_W && !pause && keyboard && (gameType == 0 || gameType == 1)) {
                    paddleLeft.setSpeedY(-paddleRightSpeed);
                }
                if (keyCode == KeyEvent.VK_S && !pause && keyboard && (gameType == 0 || gameType == 1)) {
                    paddleLeft.setSpeedY(paddleRightSpeed);
                }
                if (keyCode == KeyEvent.VK_UP && !pause && keyboard && gameType == 0) {
                    paddleRight.setSpeedY(-paddleRightSpeed);
                }
                if (keyCode == KeyEvent.VK_DOWN && !pause && keyboard && gameType == 0) {
                    paddleRight.setSpeedY(paddleRightSpeed);
                }
                if (keyCode == KeyEvent.VK_P) {
                    pause = !pause;
                }
                if (keyCode == KeyEvent.VK_R) {
                    reset(ball, ballSpeed, boardHeight, boardWidth, random, true);
                }
            }

            @Override
            public void keyReleased(KeyEvent e) {
                int keyCode = e.getKeyCode();
                if (keyCode == KeyEvent.VK_W && !pause && keyboard && (gameType == 0 || gameType == 1)) {
                    paddleLeft.setSpeedY(0);
                }
                if (keyCode == KeyEvent.VK_S && !pause && keyboard && (gameType == 0 || gameType == 1)) {
                    paddleLeft.setSpeedY(0);
                }
                if (keyCode == KeyEvent.VK_UP && !pause && keyboard && gameType == 0) {
                    paddleRight.setSpeedY(0);
                }
                if (keyCode == KeyEvent.VK_DOWN && !pause && keyboard && gameType == 0) {
                    paddleRight.setSpeedY(0);
                }
            }
        };
        frame.addKeyListener(keyListener);
        canvas.addKeyListener(keyListener);
        long start = System.nanoTime();
        while (true) {
            if (ball.getImage().getX() < 0 || ball.getImage().getX() + ball.getSizeX() > boardWidth) {
                ballLeft = !ballLeft;
                if (ball.getImage().getX() < 0) {
                    background.refreshValues(boardWidth, scoreLeft, ++scoreRight);
                }
                else {
                    background.refreshValues(boardWidth, ++scoreLeft, scoreRight);
                }
                reset(ball, ballSpeed, boardHeight, boardWidth, random, resetBehavior);
            }
            if (gameType == 2 && ballLeft) {
                double x = ball.getImage().getX() - paddleLeft.getImage().getX();
                double y = ball.getImage().getY() - paddleLeft.getImage().getY() - paddleLeft.getVariance();
                double norm = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
                paddleLeft.setSpeedY(y / norm * paddleLeftSpeed);
            }
            if ((gameType == 1 || gameType == 2) && !ballLeft) {
                double x = ball.getImage().getX() - paddleRight.getImage().getX();
                double y = ball.getImage().getY() - paddleRight.getImage().getY() - paddleRight.getVariance();
                double norm = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
                paddleRight.setSpeedY(y / norm * paddleRightSpeed);
            }
            if ((keyboard && gameType == 0) || (keyboard && gameType == 1) || (gameType == 2 && ballLeft)) {
                paddleLeft.getImage().setLocation(paddleLeft.getImage().getX(), paddleLeft.getImage().getY() + paddleLeft.getSpeedY());
            }
            if ((keyboard && gameType == 0) || (gameType == 1 && !ballLeft) || (gameType == 2 && !ballLeft)) {
                paddleRight.getImage().setLocation(paddleRight.getImage().getX(), paddleRight.getImage().getY() + paddleRight.getSpeedY());
            }
            if (ball.getImage().getY() < 0 || ball.getImage().getY() + ball.getSizeY() > boardHeight) {
                ball.setSpeedY(-ball.getSpeedY());
            }
            if (paddleLeft.getImage().getBounds().intersects(ball.getImage().getBounds()) || paddleRight.getImage().getBounds().intersects(ball.getImage().getBounds())) {
                double ballCenter = ball.getImage().getY() + ball.getSizeY() / 2.0, x;
                if (paddleLeft.getImage().getBounds().intersects(ball.getImage().getBounds())) {
                    ballLeft = false;
                    paddleRight.setVariance(random.nextInt(paddleRight.getSizeY()));
                    x = (paddleLeft.getImage().getY() + paddleLeft.getSizeY() / 2.0 - ballCenter) / (paddleLeft.getSizeY() / 2.0);
                    ball.setSpeedX(ballSpeed * Math.cos(x * Math.toRadians(bounceAngle)));
                }
                else {
                    ballLeft = true;
                    paddleLeft.setVariance(random.nextInt(paddleLeft.getSizeY()));
                    x = (paddleRight.getImage().getY() + paddleRight.getSizeY() / 2.0 - ballCenter) / (paddleRight.getSizeY() / 2.0);
                    ball.setSpeedX(-ballSpeed * Math.cos(x * Math.toRadians(bounceAngle)));
                }
                ball.setSpeedY(-ballSpeed * Math.sin(x * Math.toRadians(bounceAngle)));
            }
            ball.getImage().setLocation(ball.getImage().getX() + ball.getSpeedX(), ball.getImage().getY() + ball.getSpeedY());
            if (pause) {
                background.getLabels()[1].setVisible(true);
                while (pause) {
                    Thread.sleep(500);
                }
                background.getLabels()[1].setVisible(false);
            }
            Thread.sleep(Math.max(0, (1000000000 / framesPerSecond - (System.nanoTime() - start)) / 1000000));
            start = System.nanoTime();
        }
    }

    private static String[] makeOptions(int limit) {
        String[] list = new String[limit / 50];
        for (int i = 50; i <= limit; i += 50) {
            list[i / 50 - 1] = "" + i;
        }
        return list;
    }

    private static void reset(Ball ball, double ballSpeed, int boardHeight, int boardWidth, Random random, boolean resetBehavior) {
        if (resetBehavior) {
            ball.getImage().setLocation(boardWidth / 2.0, random.nextInt(boardHeight / 2));
            if (!ballLeft) {
                ball.setSpeedX(ballSpeed / Math.sqrt(2));
            }
            else {
                ball.setSpeedX(-ballSpeed / Math.sqrt(2));
            }
            ball.setSpeedY(ballSpeed / Math.sqrt(2));
        }
        else {
            ball.setSpeedX(-ball.getSpeedX());
        }
    }
}